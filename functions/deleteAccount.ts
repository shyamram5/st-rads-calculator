import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
    try {
        const base44 = createClientFromRequest(req);
        const user = await base44.auth.me();

        if (!user) {
            return Response.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Delete the user using the service role (admin privileges required to delete users usually, 
        // but here we allow user to delete themselves via this function)
        // We need to use service role to delete the user record
        await base44.asServiceRole.entities.User.delete(user.id);

        return Response.json({ success: true });
    } catch (error) {
        return Response.json({ error: error.message }, { status: 500 });
    }
});