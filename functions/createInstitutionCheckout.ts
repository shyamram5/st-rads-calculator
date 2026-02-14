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

        const { institution_name } = await req.json();

        if (!institution_name || !institution_name.trim()) {
            return Response.json({ error: 'Institution name is required' }, { status: 400 });
        }

        const appUrl = req.headers.get("origin") || req.headers.get("referer")?.replace(/\/[^/]*$/, "") || "https://app.base44.com";

        // Create a Stripe price for $200/year on the fly (or use a pre-created one)
        // We'll create an ad-hoc price each time to keep it simple
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            mode: 'subscription',
            line_items: [{
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: `RADS Calculator - Institutional Subscription`,
                        description: `Unlimited analyses for ${institution_name.trim()}`,
                    },
                    unit_amount: 20000, // $200.00
                    recurring: {
                        interval: 'year',
                    },
                },
                quantity: 1,
            }],
            client_reference_id: user.id,
            customer_email: user.email,
            metadata: {
                type: 'institutional',
                institution_name: institution_name.trim(),
            },
            success_url: `${appUrl}/PaymentSuccess?type=institutional`,
            cancel_url: `${appUrl}/PaymentCancel`,
        });

        return Response.json({ url: session.url });
    } catch (error) {
        console.error('Error creating institutional checkout session:', error);
        return Response.json({ error: error.message }, { status: 500 });
    }
});