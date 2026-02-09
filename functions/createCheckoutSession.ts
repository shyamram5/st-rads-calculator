import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';
import Stripe from 'npm:stripe@^15.0.0';

const stripe = new Stripe(Deno.env.get("STRIPE_API_KEY"));

Deno.serve(async (req) => {
    try {
        const base44 = createClientFromRequest(req);
        const user = await base44.auth.me();

        if (!user) {
            return Response.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const appUrl = new URL(req.url).origin;

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            mode: 'subscription',
            line_items: [{
                price: 'price_1RnAaSGCrIcHEpWiuXJImuLd',
                quantity: 1,
            }],
            client_reference_id: user.id,
            customer_email: user.email,
            success_url: `${appUrl}/PaymentSuccess`,
            cancel_url: `${appUrl}/PaymentCancel`,
        });

        return Response.json({ url: session.url });
    } catch (error) {
        console.error('Error creating checkout session:', error);
        return Response.json({ error: error.message }, { status: 500 });
    }
});