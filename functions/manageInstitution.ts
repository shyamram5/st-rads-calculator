import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
    try {
        const base44 = createClientFromRequest(req);
        const user = await base44.auth.me();

        if (!user) {
            return Response.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { action, institution_id, email } = await req.json();

        // Find institution where user is admin
        const institutions = await base44.asServiceRole.entities.Institution.filter({ admin_email: user.email, status: 'active' });
        
        if (institutions.length === 0) {
            return Response.json({ error: 'No active institution found for your account' }, { status: 404 });
        }

        const institution = institution_id 
            ? institutions.find(i => i.id === institution_id) 
            : institutions[0];

        if (!institution) {
            return Response.json({ error: 'Institution not found' }, { status: 404 });
        }

        if (action === 'add_member') {
            if (!email || !email.trim()) {
                return Response.json({ error: 'Email is required' }, { status: 400 });
            }
            const memberEmails = institution.member_emails || [];
            const trimmedEmail = email.trim().toLowerCase();
            
            if (memberEmails.includes(trimmedEmail)) {
                return Response.json({ error: 'Member already exists' }, { status: 400 });
            }

            memberEmails.push(trimmedEmail);
            await base44.asServiceRole.entities.Institution.update(institution.id, { member_emails: memberEmails });

            // Also update the member's user record if they exist
            const users = await base44.asServiceRole.entities.User.filter({ email: trimmedEmail });
            if (users.length > 0) {
                await base44.asServiceRole.entities.User.update(users[0].id, {
                    subscription_tier: 'institutional',
                    institution_id: institution.id,
                });
            }

            return Response.json({ success: true, member_emails: memberEmails });
        }

        if (action === 'remove_member') {
            if (!email || !email.trim()) {
                return Response.json({ error: 'Email is required' }, { status: 400 });
            }
            const memberEmails = institution.member_emails || [];
            const trimmedEmail = email.trim().toLowerCase();
            const updatedEmails = memberEmails.filter(e => e !== trimmedEmail);

            await base44.asServiceRole.entities.Institution.update(institution.id, { member_emails: updatedEmails });

            // Downgrade the removed member
            const users = await base44.asServiceRole.entities.User.filter({ email: trimmedEmail });
            if (users.length > 0) {
                await base44.asServiceRole.entities.User.update(users[0].id, {
                    subscription_tier: 'free',
                    institution_id: null,
                });
            }

            return Response.json({ success: true, member_emails: updatedEmails });
        }

        if (action === 'get_institution') {
            return Response.json({ institution });
        }

        return Response.json({ error: 'Invalid action' }, { status: 400 });
    } catch (error) {
        console.error('Error managing institution:', error);
        return Response.json({ error: error.message }, { status: 500 });
    }
});