import { createClientFromRequest } from 'npm:@base44/sdk@0.5.0';

Deno.serve(async (req) => {
    try {
        // Initialize client from the request, which uses the 'req' parameter
        const base44 = createClientFromRequest(req);

        let totalAnalyses = 0;

        try {
            // Use service role to get a count of all analyses across all users
            const analyses = await base44.asServiceRole.entities.LesionAnalysis.list();
            totalAnalyses = analyses ? analyses.length : 0;
        } catch (error) {
            console.log('Could not fetch analyses:', error.message);
        }

        return new Response(JSON.stringify({
            totalAnalyses,
        }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
    } catch (error) {
        console.error('Error in getStats function:', error);
        return new Response(JSON.stringify({ 
            totalAnalyses: 0, 
        }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
    }
});