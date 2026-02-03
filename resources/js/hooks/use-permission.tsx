// resources/js/hooks/usePermission.ts
import { SharedData } from '@/types';
import { usePage } from '@inertiajs/react';

export function usePermission() {
    const { auth } = usePage<SharedData>().props;

    const hasPermission = (permission: string) => {
        return auth.user?.permissions.includes(permission);
    };

    const hasRole = (role: string) => {
        return auth.user?.roles.includes(role);
    };

    return { hasPermission, hasRole };
}
