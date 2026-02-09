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

        // Find the customer by email
        const customers = await stripe.customers.list({
            email: user.email,
            limit: 1,
        });

        if (customers.data.length === 0) {
            return Response.json({ error: 'No subscription found' }, { status: 404 });
        }

        const customer = customers.data[0];

        // Find active subscriptions
        const subscriptions = await stripe.subscriptions.list({
            customer: customer.id,
            status: 'active',
            limit: 1,
        });

        if (subscriptions.data.length === 0) {
            return Response.json({ error: 'No active subscription found' }, { status: 404 });
        }

        // Cancel at period end — user keeps premium until the webhook fires
        await stripe.subscriptions.update(subscriptions.data[0].id, {
            cancel_at_period_end: true,
        });

        return Response.json({ success: true, message: 'Subscription will cancel at the end of the current billing period.' });
    } catch (error) {
        console.error('Error cancelling subscription:', error);
        return Response.json({ error: error.message }, { status: 500 });
    }
});