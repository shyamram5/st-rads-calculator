import { createClient } from 'npm:@base44/sdk@0.1.0';
import Stripe from 'npm:stripe@^15.0.0';

const stripe = new Stripe(Deno.env.get("STRIPE_API_KEY"));

Deno.serve(async (req) => {
    try {
        const base44 = createClient({
            appId: Deno.env.get('BASE44_APP_ID'),
        });

        const authHeader = req.headers.get('Authorization');
        if (!authHeader) {
            return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: { "Content-Type": "application/json" } });
        }
        const token = authHeader.split(' ')[1];
        base44.auth.setToken(token);
        const user = await base44.auth.me();
        if (!user) {
            return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: { "Content-Type": "application/json" } });
        }

        // Find the customer by email
        const customers = await stripe.customers.list({
            email: user.email,
            limit: 1
        });

        if (customers.data.length === 0) {
            return new Response(JSON.stringify({ error: 'No subscription found' }), { status: 404, headers: { "Content-Type": "application/json" } });
        }

        const customer = customers.data[0];

        // Find active subscriptions
        const subscriptions = await stripe.subscriptions.list({
            customer: customer.id,
            status: 'active',
            limit: 1
        });

        if (subscriptions.data.length === 0) {
            return new Response(JSON.stringify({ error: 'No active subscription found' }), { status: 404, headers: { "Content-Type": "application/json" } });
        }

        const subscription = subscriptions.data[0];

        // Cancel the subscription at the end of the current period
        await stripe.subscriptions.update(subscription.id, {
            cancel_at_period_end: true
        });

        // Update user status to reflect cancellation
        await base44.entities.User.update(user.id, {
            subscription_tier: 'free',
            subscription_date: null,
            analyses_used: 0 // Reset usage count
        });

        return new Response(JSON.stringify({ success: true, message: 'Subscription cancelled successfully' }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });

    } catch (error) {
        console.error('Error cancelling subscription:', error);
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
});