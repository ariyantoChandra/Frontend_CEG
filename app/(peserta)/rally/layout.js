import RoleGuard from "@/components/shared/RoleGuard";

export const metadata = {
    title: "List Game",
    description: "Halaman daftar game untuk peserta rally",
};

export default function Layout({ children }) {
    return <RoleGuard allowedRoles={["PESERTA"]}>{children}</RoleGuard>;
}