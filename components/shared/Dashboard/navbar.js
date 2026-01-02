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
  DropdownMenuItem, // Namanya ini
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

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
  if (pathname !== "/") return;

  const sectionToNavMap = {
    home: "home",
    gallery: "home",
    "competition-details": "home",

    "pre-event": "pre-event",
    resources: "pre-event",

    faq: "faq",
    "CP&Partner": "faq",
  };

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const nav = sectionToNavMap[entry.target.id];
          if (nav) setActiveNav(nav);
        }
      });
    },
    {
      root: null,
      rootMargin: "-40% 0px -40% 0px", // fokus tengah layar
      threshold: 0,
    }
  );

  Object.keys(sectionToNavMap).forEach((id) => {
    const el = document.getElementById(id);
    if (el) observer.observe(el);
  });

  return () => observer.disconnect();
}, [pathname]);


  const isAuthPage = pathname === "/login" || pathname === "/register";

  const navLinks = [
    { href: "#home", label: "Home", id: "home" },
    { href: "#pre-event", label: "Pre Event", id: "pre-event" },
    { href: "#faq", label: "FAQ", id: "faq" },
  ];

  const handleLogout = () => {
    dispatch(clearToken());
    dispatch(logoutUser());
    router.push("/");
  };

const handleScroll = (e, href) => {
  if (pathname !== "/") return;
  e.preventDefault();

  const id = href.replace("#", "");
  setActiveNav(id);

  const el = document.getElementById(id);
  if (el) {
    el.scrollIntoView({ behavior: "smooth" });
  }

  setMobileMenuOpen(false);
};


  return (
    <nav className="fixed top-0 left-0 right-0 z-50 w-full bg-white/20 backdrop-blur-md border-b border-white/30">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">

          {/* LOGO */}
          <Link href="/" className="flex items-center gap-3">
            <Image src="/Asset/CEG HOMEPAGE.png" alt="CEG" width={100} height={100} />
          </Link>

          {/* NAV LINKS */}
          {!isAuthPage && (
            <div className="hidden md:flex items-center gap-10">
              {navLinks.map((link) => {
                const isActive = activeNav === link.id;
                return (
                  <Link
                    key={link.id}
                    href={link.href}
                    onClick={(e) => handleScroll(e, link.href)}
                    className={`relative font-bold transition-all duration-300 py-1 text-sm tracking-wide ${
                      isActive ? "text-teal-800" : "text-teal-900/40 hover:text-teal-700"
                    }`}
                  >
                    {link.label}
                    {isActive && (
                      <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-teal-800 rounded-full animate-in fade-in slide-in-from-bottom-1 duration-500" />
                    )}
                  </Link>
                );
              })}
            </div>
          )}

          {/* ACTION BUTTON - Sekarang tidak muncul di halaman Login/Register */}
          <div className="hidden md:flex items-center gap-4">
            {!isMounted ? null : token ? (
              <>
                <Button variant="ghost" className="font-bold text-teal-900 hover:bg-white/40" onClick={() => router.push('/rally')}>
                  Rally
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="border-teal-800/30 text-teal-900 bg-white/40 rounded-full font-bold px-5">
                        {user}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48 bg-white/95 backdrop-blur-md">
                    <DropdownMenuLabel>Akun Saya</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {/* PERBAIKAN DI SINI: Gunakan DropdownMenuItem bukan DropdownMenuMenuItem */}
                    <DropdownMenuItem onClick={handleLogout} className="text-red-600 font-bold cursor-pointer">
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              // Tombol Login hanya muncul jika BUKAN halaman login/register dan BUKAN kondisi sudah login
              !isAuthPage && (
                <Link href="/login" className="bg-teal-800 hover:bg-teal-900 text-white px-8 py-2 rounded-full font-bold transition shadow-lg">
                  Login
                </Link>
              )
            )}
          </div>

          {/* MOBILE TOGGLE */}
          <Button variant="ghost" className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </Button>
        </div>
      </div>

      {/* MOBILE MENU */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-2xl p-6 space-y-4 border-b border-teal-100 animate-in slide-in-from-top duration-300">
          {!isAuthPage && navLinks.map((link) => (
            <Link
              key={link.id}
              href={link.href}
              className={`block text-2xl font-black ${activeNav === link.id ? "text-teal-800" : "text-teal-900/30"}`}
              onClick={(e) => handleScroll(e, link.href)}
            >
              {link.label}
            </Link>
          ))}
          {/* AUTH BUTTON */}
          {!isMounted ? null : token ? (
            <div className="pt-4 border-t border-teal-200 space-y-3">
              <Button
                className="w-full font-bold"
                onClick={() => {
                  router.push("/rally");
                  setMobileMenuOpen(false);
                }}
              >
                Rally
              </Button>

              <Button
                variant="destructive"
                className="w-full font-bold"
                onClick={() => {
                  handleLogout();
                  setMobileMenuOpen(false);
                }}
              >
                Logout
              </Button>
            </div>
          ) : (
            !isAuthPage && (
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-center bg-teal-800 hover:bg-teal-900 text-white py-3 rounded-full font-bold shadow-lg"
              >
                Login
              </Link>
            )
          )}
        </div>
      )}
    </nav>
  );
}