import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';
import Stripe from 'npm:stripe@^15.0.0';

const stripe = new Stripe(Deno.env.get("STRIPE_API_KEY"));

Deno.serve(async (req) => {
    // Initialize base44 with service role for admin-level user updates
    const base44 = createClientFromRequest(req);

    const signature = req.headers.get('stripe-signature');
    const body = await req.text();

    try {
        const event = await stripe.webhooks.constructEventAsync(
            body,
            signature,
            Deno.env.get("STRIPE_WEBHOOK_SECRET")
        );

        if (event.type === 'checkout.session.completed') {
            const session = event.data.object;
            const userId = session.client_reference_id;

            if (!userId) {
                console.error("Webhook Error: No client_reference_id in session", session.id);
                return new Response('Webhook Error: Missing user ID', { status: 400 });
            }

            // Check if this is an institutional subscription
            if (session.metadata?.type === 'institutional') {
                const institutionName = session.metadata.institution_name;
                const userEmail = session.customer_email || session.customer_details?.email;

                // Create institution record
                await base44.asServiceRole.entities.Institution.create({
                    name: institutionName,
                    admin_email: userEmail,
                    stripe_customer_id: session.customer,
                    stripe_subscription_id: session.subscription,
                    status: 'active',
                    subscription_date: new Date().toISOString(),
                    member_emails: [userEmail],
                });

                // Update admin user
                await base44.asServiceRole.entities.User.update(userId, {
                    subscription_tier: 'institutional',
                    subscription_date: new Date().toISOString(),
                    stripe_customer_id: session.customer,
                });

                console.log(`Successfully created institution "${institutionName}" for user ${userId}.`);
            } else {
                await base44.asServiceRole.entities.User.update(userId, {
                    subscription_tier: 'premium',
                    subscription_date: new Date().toISOString(),
                    stripe_customer_id: session.customer,
                });

                console.log(`Successfully upgraded user ${userId} to premium.`);
            }
        }

        if (event.type === 'customer.subscription.deleted') {
            const subscription = event.data.object;
            const customerId = subscription.customer;

            // Check if this is an institutional subscription
            const institutions = await base44.asServiceRole.entities.Institution.filter({ stripe_customer_id: customerId });
            if (institutions.length > 0) {
                const institution = institutions[0];
                // Downgrade all members
                const memberEmails = institution.member_emails || [];
                for (const email of memberEmails) {
                    const members = await base44.asServiceRole.entities.User.filter({ email });
                    if (members.length > 0) {
                        await base44.asServiceRole.entities.User.update(members[0].id, {
                            subscription_tier: 'free',
                            institution_id: null,
                        });
                    }
                }
                await base44.asServiceRole.entities.Institution.update(institution.id, { status: 'cancelled' });
                console.log(`Successfully cancelled institution "${institution.name}".`);
            } else {
                // Individual subscription
                const users = await base44.asServiceRole.entities.User.filter({ stripe_customer_id: customerId });
                if (users.length > 0) {
                    await base44.asServiceRole.entities.User.update(users[0].id, {
                        subscription_tier: 'free',
                        subscription_date: null,
                        analyses_used: 0,
                    });
                    console.log(`Successfully downgraded user ${users[0].id} to free tier.`);
                } else {
                    console.error(`No user found with stripe_customer_id: ${customerId}`);
                }
            }
        }

        return Response.json({ received: true });
    } catch (err) {
        console.error(`Webhook error: ${err.message}`);
        return new Response(`Webhook Error: ${err.message}`, { status: 400 });
    }
});