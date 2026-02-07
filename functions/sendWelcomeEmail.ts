import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
    try {
        const base44 = createClientFromRequest(req);
        const { data } = await req.json();

        if (!data || !data.email) {
            return Response.json({ error: 'No user data provided' }, { status: 400 });
        }

        const userName = data.full_name || 'there';
        const userEmail = data.email;

        const emailBody = `
<div style="font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif; max-width: 600px; margin: 0 auto; color: #1e293b;">
    <div style="background: linear-gradient(135deg, #3b82f6 0%, #6366f1 100%); padding: 32px; border-radius: 12px 12px 0 0; text-align: center;">
        <h1 style="color: white; margin: 0; font-size: 24px;">Welcome to ST-RADS Calculator</h1>
        <p style="color: rgba(255,255,255,0.85); margin: 8px 0 0 0; font-size: 14px;">Your Radiology Decision-Support Tool</p>
    </div>

    <div style="padding: 32px; background: #ffffff; border: 1px solid #e2e8f0; border-top: none;">
        <p style="font-size: 16px; line-height: 1.6;">Hi ${userName},</p>

        <p style="font-size: 15px; line-height: 1.6;">Welcome to <strong>ST-RADS Calculator</strong> — the first deterministic, guideline-based scoring tool for soft tissue lesions built on the ST-RADS v2025 framework by Chhabra et al.</p>

        <h2 style="font-size: 16px; color: #3b82f6; margin-top: 24px;">Here's what you can do today:</h2>
        <ul style="font-size: 14px; line-height: 2; padding-left: 20px;">
            <li>🧮 <strong>Score soft tissue lesions</strong> step-by-step using the validated ST-RADS v2025 flowcharts</li>
            <li>📚 <strong>Explore case examples</strong> with detailed imaging findings and teaching points</li>
            <li>🤖 <strong>AI-powered case review</strong> (Premium) — upload images for AI-assisted analysis</li>
            <li>📋 <strong>Generate structured reports</strong> ready to paste into your workflow</li>
        </ul>

        <h2 style="font-size: 16px; color: #3b82f6; margin-top: 24px;">What's coming next:</h2>
        <p style="font-size: 14px; line-height: 1.6;">We're actively building out support for additional RADS classification systems, including:</p>
        <ul style="font-size: 14px; line-height: 2; padding-left: 20px;">
            <li><strong>LI-RADS</strong> — Liver Imaging Reporting and Data System</li>
            <li><strong>BI-RADS</strong> — Breast Imaging Reporting and Data System</li>
            <li><strong>TI-RADS</strong> — Thyroid Imaging Reporting and Data System</li>
            <li><strong>PI-RADS</strong> — Prostate Imaging Reporting and Data System</li>
            <li><strong>Lung-RADS</strong> — Lung Cancer Screening Reporting and Data System</li>
        </ul>
        <p style="font-size: 14px; line-height: 1.6;">Our goal is to become the go-to platform for <strong>standardized radiology decision support</strong> across all major RADS frameworks — deterministic, evidence-based, and always up to date with the latest guidelines.</p>

        <div style="background: #f0f9ff; border: 1px solid #bae6fd; border-radius: 8px; padding: 20px; margin-top: 24px;">
            <h3 style="font-size: 15px; color: #0369a1; margin: 0 0 8px 0;">📣 Know a colleague who'd find this useful?</h3>
            <p style="font-size: 14px; line-height: 1.6; margin: 0; color: #0c4a6e;">We're growing through word of mouth in the radiology community. If you have fellow radiologists, residents, or fellows who could benefit from a fast, guideline-based scoring tool, please share the link with them. The more radiologists who use and provide feedback, the better we can make this tool for everyone.</p>
        </div>

        <p style="font-size: 14px; line-height: 1.6; margin-top: 24px;">Thank you for joining us early — your input shapes what we build next.</p>
        <p style="font-size: 14px; line-height: 1.6;">Best,<br/><strong>The ST-RADS Calculator Team</strong></p>
    </div>

    <div style="padding: 20px; background: #fefce8; border: 1px solid #e2e8f0; border-top: none; border-radius: 0 0 12px 12px;">
        <p style="font-size: 11px; color: #92400e; margin: 0; line-height: 1.5; text-align: center;">
            <strong>Medical Disclaimer:</strong> This tool is for educational and research purposes only. It is not FDA approved and does not replace professional medical evaluation.
        </p>
    </div>
</div>
`;

        await base44.asServiceRole.integrations.Core.SendEmail({
            to: userEmail,
            subject: "Welcome to ST-RADS Calculator — Your Radiology Decision-Support Tool",
            body: emailBody,
            from_name: "ST-RADS Calculator"
        });

        return Response.json({ success: true, message: `Welcome email sent to ${userEmail}` });
    } catch (error) {
        return Response.json({ error: error.message }, { status: 500 });
    }
});