import { createClient } from 'npm:@base44/sdk@0.1.0';
import Stripe from 'npm:stripe@^15.0.0';

const stripe = new Stripe(Deno.env.get("STRIPE_API_KEY"));

// This is the admin client, it has full access to the data
const base44 = createClient({
    appId: Deno.env.get('BASE44_APP_ID'),
    apiKey: Deno.env.get('BASE44_API_KEY'),
});

Deno.serve(async (req) => {
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

            // Update user to premium
            await base44.entities.User.update(userId, {
                subscription_tier: 'premium',
                subscription_date: new Date().toISOString(),
            });

            console.log(`Successfully upgraded user ${userId} to premium.`);
        }

        // Handle subscription cancellations
        if (event.type === 'customer.subscription.deleted') {
            const subscription = event.data.object;
            const customer = await stripe.customers.retrieve(subscription.customer);
            
            if (customer.email) {
                // Find user by email and downgrade
                const users = await base44.entities.User.filter({ email: customer.email });
                if (users.length > 0) {
                    await base44.entities.User.update(users[0].id, {
                        subscription_tier: 'free',
                        subscription_date: null,
                        analyses_used: 0
                    });
                    console.log(`Successfully downgraded user ${users[0].id} to free tier.`);
                }
            }
        }

        return new Response(JSON.stringify({ received: true }), { status: 200 });
    } catch (err) {
        console.error(`Webhook signature verification failed: ${err.message}`);
        return new Response(`Webhook Error: ${err.message}`, { status: 400 });
    }
});