import Navbar from "@/components/shared/Dashboard/navbar";
import RoleGuard from "@/components/shared/RoleGuard";

export default function Layout({ children }) {
    return (
        <div>
            <Navbar />
            {children}
        </div>
    );
}