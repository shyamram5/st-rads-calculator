import { base44 } from "@/api/base44Client";

export const User = {
    login: async () => {
        await base44.auth.redirectToLogin(window.location.href);
    },
    logout: async () => {
        await base44.auth.logout();
    },
    me: async () => {
        // In local development, return a mock user to avoid forcing Base44 auth.
        if (typeof window !== 'undefined') {
            const host = window.location.hostname;
            const isLocalHost = host === 'localhost' || host === '127.0.0.1' || /^192\.168\./.test(host) || /^10\./.test(host);
            if (isLocalHost || import.meta.env.MODE === 'development') {
                return {
                    id: 'dev-user',
                    email: 'dev@local',
                    full_name: 'Developer',
                    subscription_tier: 'free',
                    analyses_used: 0
                };
            }
        }
        try {
            return await base44.auth.me();
        } catch (e) {
            return null;
        }
    },
    updateMyUserData: async (data) => {
        return await base44.auth.updateMe(data);
    }
};