"use client";

import { useEffect } from "react";
import { useAppDispatch } from "@/core/store/hooks";
import { clearToken } from "@/core/feature/token/tokenSlice";
import { clearUser, logout } from "@/core/feature/user/userSlice";
import { clearRole } from "@/core/feature/role/roleSlice";

export default function AuthSync() {
    const dispatch = useAppDispatch();

    useEffect(() => {
        const checkTokenCookie = () => {
            if (typeof window === 'undefined' || typeof document === 'undefined') return;

            try {
                const tokenFromCookie = document.cookie
                    ?.split('; ')
                    ?.find((c) => c.startsWith('token='))
                    ?.split('=')[1];

                if (!tokenFromCookie) {
                    const hasToken = localStorage.getItem('token');
                    const hasRole = localStorage.getItem('role');
                    const hasUser = localStorage.getItem('user');
                    const hasUserId = localStorage.getItem('user_id');

                    if (hasToken || hasRole || hasUser || hasUserId) {
                        localStorage.removeItem('token');
                        localStorage.removeItem('role');
                        localStorage.removeItem('user');
                        localStorage.removeItem('user_id');
                        localStorage.removeItem('userPenpos');

                        dispatch(clearToken());
                        dispatch(clearRole());
                        dispatch(logout());
                    }
                }
            } catch (error) {
                console.error('Error checking token cookie:', error);
            }
        };

        checkTokenCookie();

        const interval = setInterval(checkTokenCookie, 30000);

        window.addEventListener('focus', checkTokenCookie);

        return () => {
            clearInterval(interval);
            window.removeEventListener('focus', checkTokenCookie);
        };
    }, [dispatch]);

    return null;
}
