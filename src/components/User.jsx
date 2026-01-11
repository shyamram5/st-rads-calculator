import { base44 } from "@/api/base44Client";

export const User = {
    login: async () => {
        await base44.auth.redirectToLogin();
    },
    logout: async () => {
        await base44.auth.logout();
    },
    me: async () => {
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