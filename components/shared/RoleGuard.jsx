"use client";

import Loader from "@/components/shared/Loader";
import { useRoleGuard } from "@/core/hooks/useRoleGuard";

export default function RoleGuard({ allowedRoles, children }) {
    const { isChecking } = useRoleGuard({ allowedRoles });

    if (isChecking) return <Loader />;

    return children;
}