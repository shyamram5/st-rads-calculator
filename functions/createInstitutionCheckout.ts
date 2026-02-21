import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';
import Stripe from 'npm:stripe@^15.0.0';

const stripe = new Stripe(Deno.env.get("STRIPE_API_KEY"));

const TIER_CONFIG = {
  academic: {
    name: "Academic / Small Practice",
    amount: 300000, // $3,000
    description: "1–10 radiologists · All 4 RADS systems",
  },
  department: {
    name: "Medium Department",
    amount: 600000, // $6,000
    description: "11–25 radiologists · All 4 RADS systems",
  },
  enterprise: {
    name: "Large / Enterprise",
    amount: 1200000, // $12,000
    description: "25+ radiologists · Multi-site · All 4 RADS systems",
  },
};

Deno.serve(async (req) => {
    try {
        const base44 = createClientFromRequest(req);
        const user = await base44.auth.me();

        if (!user) {
            return Response.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { institution_name, tier } = await req.json();

        if (!institution_name || !institution_name.trim()) {
            return Response.json({ error: 'Institution name is required' }, { status: 400 });
        }

        const tierKey = tier || "academic";
        const tierConfig = TIER_CONFIG[tierKey];
        if (!tierConfig) {
            return Response.json({ error: 'Invalid tier' }, { status: 400 });
        }

        const appUrl = req.headers.get("origin") || req.headers.get("referer")?.replace(/\/[^/]*$/, "") || "https://app.base44.com";

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            mode: 'subscription',
            line_items: [{
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: `RADS Calculator - ${tierConfig.name}`,
                        description: `${tierConfig.description} · ${institution_name.trim()}`,
                    },
                    unit_amount: tierConfig.amount,
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
                tier: tierKey,
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