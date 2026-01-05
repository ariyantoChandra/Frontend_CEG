"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { useAppSelector, useAppDispatch } from "@/core/store/hooks";
import { clearToken } from "@/core/feature/token/tokenSlice";
import { logout as logoutUser } from "@/core/feature/user/userSlice";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Image from "next/image";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [activeNav, setActiveNav] = useState("home");
  const token = useAppSelector((state) => state.token.token);
  const user = useAppSelector((state) => state.user.user);
  const [role, setRole] = useState(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setRole(localStorage.getItem("role"));
    }
    setIsMounted(true);
  }, []);

  // ... useEffect Observer Scroll tetap sama ...

  const isAuthPage = pathname === "/login" || pathname === "/register";
  const navLinks = [
    { href: "/#home", label: "Home", id: "home" }, // Tambahkan slash agar bisa diakses dari page lain
    { href: "/#pre-event", label: "Pre Event", id: "pre-event" },
    { href: "/#faq", label: "FAQ", id: "faq" },
  ];

  const handleLogout = () => {
    dispatch(clearToken());
    dispatch(logoutUser());
    router.push("/");
  };

  const handleScroll = (e, href) => {
      // Logic scroll hanya jalan di homepage
      if (pathname === '/' && href.startsWith('/#')) {
           e.preventDefault();
           const id = href.replace("/#", "");
           setActiveNav(id);
           const el = document.getElementById(id);
           if (el) el.scrollIntoView({ behavior: "smooth" });
      }
      setMobileMenuOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 w-full bg-white/20 backdrop-blur-md border-b border-white/30">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <Image src="/Asset/CEG HOMEPAGE.png" alt="CEG" width={100} height={100} />
          </Link>

          {!isAuthPage && (
            <div className="hidden md:flex items-center gap-10">
              {navLinks.map((link) => (
                <Link
                  key={link.id}
                  href={link.href}
                  onClick={(e) => handleScroll(e, link.href)}
                  className={`relative font-bold transition-all duration-300 py-1 text-sm tracking-wide ${activeNav === link.id && pathname === '/' ? "text-teal-800" : "text-teal-900/40 hover:text-teal-700"}`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          )}

          <div className="hidden md:flex items-center gap-4">
            {!isMounted ? null : token ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="border-teal-800/30 text-teal-900 bg-white/40 rounded-full font-bold px-5">
                    {user}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48 bg-white/95 backdrop-blur-md">
                  <DropdownMenuLabel>Akun Saya</DropdownMenuLabel>
                  
                  {/* LINK DASHBOARD ADMIN */}
                  {role === "ADMIN" && (
                    <DropdownMenuItem onClick={() => router.push("/admin")} className="cursor-pointer font-medium text-teal-900">
                      Dashboard Admin
                    </DropdownMenuItem>
                  )}
                  
                  {/* LINK DASHBOARD PESERTA (BARU) */}
                  {role !== "ADMIN" && (
                    <DropdownMenuItem onClick={() => router.push("/dashboard")} className="cursor-pointer font-medium text-teal-900">
                      Dashboard Tim
                    </DropdownMenuItem>
                  )}

                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-red-600 font-bold cursor-pointer">
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              !isAuthPage && (
                <Link href="/login" className="bg-teal-800 hover:bg-teal-900 text-white px-8 py-2 rounded-full font-bold transition shadow-lg">
                  Login
                </Link>
              )
            )}
          </div>
          {/* Mobile Menu Toggle Button */}
          <Button variant="ghost" className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
             {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </Button>
        </div>
      </div>
      {/* Mobile Menu Render (Sama seperti sebelumnya) */}
      {mobileMenuOpen && (
         <div className="md:hidden bg-white/95 backdrop-blur-2xl p-6 space-y-4 border-b border-teal-100 animate-in slide-in-from-top duration-300">
             {/* ... isi mobile menu ... */}
         </div>
      )}
    </nav>
  );
}