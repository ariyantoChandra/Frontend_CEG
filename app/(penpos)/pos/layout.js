import RoleGuard from "@/components/shared/RoleGuard";

export const metadata = {
    title: "Penpos",
    description: "Halaman Pos - Chemical Engineering Games",
};

export default function Layout({ children }) {
    return <RoleGuard allowedRoles={["PENPOS"]}>{children}</RoleGuard>;
}