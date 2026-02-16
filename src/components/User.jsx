import { base44 } from "@/api/base44Client";

export const User = {
    login: async () => {
        try {
            const from = encodeURIComponent(window.location.href);
            const serverUrl = appParams.serverUrl || '';

            if (serverUrl) {
                try {
                    const parsed = new URL(serverUrl, window.location.href);
                    if (parsed.origin !== window.location.origin) {
                        const basePath = `${parsed.origin.replace(/\/$/, '')}${parsed.pathname.replace(/\/$/, '')}`;
                        window.location.href = `${basePath}/login?from_url=${from}`;
                        return;
                    }
                } catch (e) {
                    console.warn('User.login: failed to parse serverUrl, falling back to SDK', e);
                }
            }

            if (base44 && base44.auth && typeof base44.auth.redirectToLogin === 'function') {
                await base44.auth.redirectToLogin(window.location.href);
                return;
            }

            // Fallback: navigate to app root to avoid /login 404
            window.location.href = '/';
        } catch (e) {
            console.error('User.login error:', e);
            window.location.href = '/';
        }
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