"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAppSelector } from "@/core/store/hooks";

const ROLE_HOME = {
    PESERTA: "/",
    PENPOS: "/pos",
    ADMIN: "/admin",
};

export const useRoleGuard = ({
    allowedRoles,
    fallbackWhenNoRole = "/login",
    roleHome = ROLE_HOME,
} = {}) => {
    const router = useRouter();
    const pathname = usePathname();
    const roleFromStore = useAppSelector((state) => state.role.role);
    const [isChecking, setIsChecking] = useState(true);

    useEffect(() => {
        const resolvedRole =
            roleFromStore ||
            (typeof window !== "undefined" ? localStorage.getItem("role") : null);

        if (!resolvedRole) {
            if (fallbackWhenNoRole) {
                const isProtectedRoute = pathname.startsWith("/pos") || 
                                        pathname.startsWith("/admin") || 
                                        pathname.startsWith("/rally");
                
                if (isProtectedRoute && fallbackWhenNoRole === "/login") {
                    router.replace("/");
                } else {
                    router.replace(`${fallbackWhenNoRole}?from=${encodeURIComponent(pathname)}`);
                }
            }
            return;
        }

        const isAllowed = !allowedRoles || allowedRoles.includes(resolvedRole);
        if (!isAllowed) {
            const target = roleHome[resolvedRole] || "/";
            if (pathname !== target) router.replace(target);
            return;
        }

        setIsChecking(false);
    }, [allowedRoles, fallbackWhenNoRole, pathname, roleFromStore, roleHome, router]);

    return { isChecking };
};

export default useRoleGuard;