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
import * as API from "@/core/services/api";
import useSWR from "swr";
import { Badge } from "@/components/ui/badge";


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
  const [user_id, setUser_id] = useState(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setRole(localStorage.getItem("role"));
      setUser_id(localStorage.getItem("user_id"));
    }
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
        rootMargin: "-40% 0px -40% 0px",
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
    { href: "/#home", label: "Home", id: "home" },
    { href: "/#pre-event", label: "Pre Event", id: "pre-event" },
    { href: "/#faq", label: "FAQ", id: "faq" },
  ];

  const handleLogout = () => {
    dispatch(clearToken());
    dispatch(logoutUser());
    localStorage.removeItem("user_id");
    localStorage.removeItem("role");
    localStorage.removeItem("gameStatus");
    localStorage.removeItem("game_data");
    if (typeof document !== "undefined") {
      document.cookie = "token=; path=/; max-age=0";
      document.cookie = "settings=; path=/; max-age=0";
    }
    router.replace("/");
  };

  const handleScroll = (e, href) => {
    if (pathname === '/' && href.startsWith('/#')) {
      e.preventDefault();
      const id = href.replace("/#", "");
      setActiveNav(id);

      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
    }
    setMobileMenuOpen(false);
  };

  const { data: statusPayment } = useSWR(
    user_id && role !== "PENPOS" && role !== "ADMIN" ? ["get-status-payment", user_id] : null,
    async () => {
      const query = {
        user_id: user_id,
      };

      const response = await API.user.getStatusPayment(query);
      return response?.data?.data?.status_pembayaran || null;
    }
  );

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 w-full bg-white/20 backdrop-blur-md border-b border-white/30">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">

          <Link href="/" className="flex items-center gap-3">
            <Image src="/Asset/CEG HOMEPAGE.webp" alt="CEG" width={100} height={100} />
          </Link>

          {!isAuthPage && (
            <div className="hidden md:flex items-center gap-10">
              {navLinks.map((link) => {
                const isActive = activeNav === link.id && pathname === '/';
                return (
                  <Link
                    key={link.id}
                    href={link.href}
                    onClick={(e) => handleScroll(e, link.href)}
                    className={`relative font-bold transition-all duration-300 py-1 text-sm tracking-wide ${isActive ? "text-teal-800" : "text-teal-900/40 hover:text-teal-700"
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

          <div className="hidden md:flex items-center gap-4">
            {!isMounted ? null : token ? (
              <>
                {role === "PESERTA" && (
                  <Button variant="outline" className="font-bold text-teal-900 hover:bg-white/40" onClick={() => router.push('/rally')}>
                    Rally
                  </Button>
                )}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="border-teal-800/30 text-teal-900 bg-white/40 rounded-full font-bold px-5">
                      {user}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48 bg-white/95 backdrop-blur-md">
                    <DropdownMenuLabel>Akun Saya</DropdownMenuLabel>

                    {role === "ADMIN" && (
                      <DropdownMenuItem onClick={() => router.push("/admin")} className="cursor-pointer font-medium text-teal-900">
                        Dashboard Admin
                      </DropdownMenuItem>
                    )}

                    {role === "PENPOS" && (
                      <DropdownMenuItem onClick={() => router.push("/pos")} className="cursor-pointer font-medium text-teal-900">
                        Dashboard Penpos
                      </DropdownMenuItem>
                    )}

                    {role === "PESERTA" && (
                      <DropdownMenuItem>
                        <Badge
                          className={`rounded-none font-bold shadow-lg text-sm ${statusPayment === "unverified" ? "text-white bg-yellow-300" : "text-white bg-green-500"}`}
                        >
                          {statusPayment === "unverified" ? "Menunggu Terverifikasi" : "Terverifikasi"}
                        </Badge>
                      </DropdownMenuItem>
                    )}

                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout} className="text-red-600 font-bold cursor-pointer">
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              !isAuthPage && (
                <Link href="/login" className="bg-teal-800 hover:bg-teal-900 text-white px-8 py-2 rounded-full font-bold transition shadow-lg">
                  Login
                </Link>
              )
            )}
          </div>

          {!isAuthPage && (
            <Button className="md:hidden bg-gray-400" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </Button>
          )}
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-2xl p-6 space-y-4 border-b border-teal-100 animate-in slide-in-from-top duration-300">
          {!isAuthPage && navLinks.map((link) => (
            <Link
              key={link.id}
              href={link.href}
              className={`block text-2xl font-black ${activeNav === link.id && pathname === '/' ? "text-teal-800" : "text-teal-900/30"}`}
              onClick={(e) => handleScroll(e, link.href)}
            >
              {link.label}
            </Link>
          ))}

          {!isMounted ? null : token ? (
            <div className="pt-4 border-t border-teal-200 space-y-3">
              {role === "PESERTA" && (
                <>
                  <Badge
                    className={`py-2 rounded-none w-full font-bold shadow-lg text-sm ${statusPayment === "unverified" ? "text-white bg-yellow-300" : statusPayment === "verified" ? "text-white bg-green-500" : "text-white bg-yellow-500"}`}
                  >
                    {statusPayment === "unverified" ? "Menunggu Terverifikasi" : statusPayment === "verified" ? "Terverifikasi" : "Menunggu Verifikasi"}
                  </Badge>
                  <div className="border-t"></div>
                  <Button
                    variant="outline"
                    className="w-full font-bold bg-teal-800 text-white"
                    onClick={() => {
                      router.push("/rally");
                      setMobileMenuOpen(false);
                    }}
                  >
                    Rally
                  </Button>
                </>
              )}
              {role === "PENPOS" && (
                <Button
                  variant="outline"
                  className="w-full font-bold bg-teal-800 text-white"
                  onClick={() => {
                    router.push("/pos");
                    setMobileMenuOpen(false);
                  }}
                >
                  Dashboard Penpos
                </Button>
              )}
              {role === "ADMIN" && (
                <Button
                  className="w-full font-bold bg-teal-800 text-white"
                  onClick={() => {
                    router.push("/admin");
                    setMobileMenuOpen(false);
                  }}
                >
                  Dashboard Admin
                </Button>
              )}

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