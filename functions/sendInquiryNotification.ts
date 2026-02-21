import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

const NOTIFY_EMAIL = "shyamram5@tamu.edu";

Deno.serve(async (req) => {
    try {
        const base44 = createClientFromRequest(req);
        const user = await base44.auth.me();

        if (!user) {
            return Response.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { inquiry } = await req.json();

        if (!inquiry) {
            return Response.json({ error: 'Inquiry data is required' }, { status: 400 });
        }

        const tierLabels = {
            academic: "Academic / Small Practice (1–10 rads)",
            department: "Medium Department (11–25 rads)",
            enterprise: "Large / Enterprise (25+ rads)",
            unsure: "Unsure",
        };

        const subject = `New Institutional Inquiry: ${inquiry.institution_name} — ${tierLabels[inquiry.tier_interest] || inquiry.tier_interest}`;

        const body = `
<h2>New Institutional Plan Inquiry</h2>
<table style="border-collapse:collapse;width:100%;max-width:600px;font-family:sans-serif;">
  <tr><td style="padding:8px;font-weight:bold;border-bottom:1px solid #eee;">Institution</td><td style="padding:8px;border-bottom:1px solid #eee;">${inquiry.institution_name}</td></tr>
  <tr><td style="padding:8px;font-weight:bold;border-bottom:1px solid #eee;">Tier Interest</td><td style="padding:8px;border-bottom:1px solid #eee;">${tierLabels[inquiry.tier_interest] || inquiry.tier_interest}</td></tr>
  <tr><td style="padding:8px;font-weight:bold;border-bottom:1px solid #eee;">Contact Name</td><td style="padding:8px;border-bottom:1px solid #eee;">${inquiry.contact_name}</td></tr>
  <tr><td style="padding:8px;font-weight:bold;border-bottom:1px solid #eee;">Contact Email</td><td style="padding:8px;border-bottom:1px solid #eee;"><a href="mailto:${inquiry.contact_email}">${inquiry.contact_email}</a></td></tr>
  ${inquiry.contact_phone ? `<tr><td style="padding:8px;font-weight:bold;border-bottom:1px solid #eee;">Phone</td><td style="padding:8px;border-bottom:1px solid #eee;">${inquiry.contact_phone}</td></tr>` : ''}
  ${inquiry.department ? `<tr><td style="padding:8px;font-weight:bold;border-bottom:1px solid #eee;">Department</td><td style="padding:8px;border-bottom:1px solid #eee;">${inquiry.department}</td></tr>` : ''}
  ${inquiry.num_radiologists ? `<tr><td style="padding:8px;font-weight:bold;border-bottom:1px solid #eee;"># Radiologists</td><td style="padding:8px;border-bottom:1px solid #eee;">${inquiry.num_radiologists}</td></tr>` : ''}
  ${inquiry.num_sites ? `<tr><td style="padding:8px;font-weight:bold;border-bottom:1px solid #eee;"># Sites</td><td style="padding:8px;border-bottom:1px solid #eee;">${inquiry.num_sites}</td></tr>` : ''}
  ${inquiry.message ? `<tr><td style="padding:8px;font-weight:bold;border-bottom:1px solid #eee;">Message</td><td style="padding:8px;border-bottom:1px solid #eee;">${inquiry.message}</td></tr>` : ''}
</table>
<p style="margin-top:16px;color:#666;font-size:12px;">Submitted via RADS Calculator institutional inquiry form.</p>
        `.trim();

        await base44.integrations.Core.SendEmail({
            to: NOTIFY_EMAIL,
            subject,
            body,
        });

        return Response.json({ success: true });
    } catch (error) {
        console.error('Error sending inquiry notification:', error);
        return Response.json({ error: error.message }, { status: 500 });
    }
});