"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { admin } from "@/core/services/api"; // Import API admin
import { Loader2, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function AdminDashboard() {
  const router = useRouter();
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchTeams();
  }, []);

  const fetchTeams = async () => {
    try {
      const res = await admin.getAllTeams();

      // Mengambil data dari res.data.data
      if (res.data && res.data.data) {
        setTeams(res.data.data);
      } else {
        setTeams([]);
      }
    } catch (error) {
      console.error("Gagal ambil data:", error);
      setTeams([]);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("user");
    // Hapus cookie jika pakai cookie storage juga
    document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
    router.push("/login");
  };

  // Filter pencarian sederhana
  const filteredTeams = teams.filter((t) =>
    t.nama_tim.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="animate-spin text-teal-800" size={48} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Dashboard */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <h1 className="text-3xl font-black text-teal-900">
              ADMIN DASHBOARD
            </h1>
            <p className="text-gray-500">Kelola pendaftaran tim CEG 2026</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-3 text-gray-400" size={20} />
              <Input
                placeholder="Cari nama tim..."
                className="pl-10 bg-white text-black"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <Button onClick={handleLogout} variant="destructive">Logout</Button>
          </div>
        </div>

        {/* Grid Kartu Tim */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTeams.map((team) => (
            <Card
              key={team.id}
              className="cursor-pointer hover:shadow-lg transition-all hover:scale-[1.02] border-t-4 border-t-teal-800"
              onClick={() => router.push(`/admin/team/${team.id}`)}
            >
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-xl font-bold text-teal-900 uppercase truncate pr-2">
                    {team.nama_tim}
                  </CardTitle>
                  
                  {/* Badge Status Pembayaran */}
                  {team.status_pembayaran === "verified" ? (
                    <Badge className="bg-green-100 text-green-700 hover:bg-green-200 border-0 shrink-0">
                      Verified
                    </Badge>
                  ) : (
                    <Badge className="bg-red-100 text-red-700 hover:bg-red-200 border-0 shrink-0">
                      Unverified
                    </Badge>
                  )}
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-3 text-sm text-gray-600">
                  <p className="flex items-center gap-2">
                    <span className="font-semibold min-w-[70px]">Sekolah:</span>{" "}
                    <span className="truncate">{team.asal_sekolah}</span>
                  </p>

                  {/* === BAGIAN BARU: LABEL PAKET === */}
                  <div className="flex items-center gap-2">
                    <span className="font-semibold min-w-[70px]">Paket:</span>
                    <Badge 
                      className={
                        // Logika Warna: Ungu (Bundle), Biru (Single)
                        (team.paket && team.paket.toLowerCase().includes('bundle')) 
                          ? "bg-purple-100 text-purple-700 hover:bg-purple-200 border-0" 
                          : "bg-blue-100 text-blue-700 hover:bg-blue-200 border-0"
                      }
                    >
                      {/* Tampilkan uppercase biar rapi */}
                      {team.paket ? team.paket.toUpperCase() : "SINGLE"}
                    </Badge>
                  </div>
                  {/* ================================= */}

                  <p className="flex items-center gap-2">
                    <span className="font-semibold min-w-[70px]">Anggota:</span>{" "}
                    {/* Fallback kalau jumlah_anggota null/undefined */}
                    {team.jumlah_anggota || "-"} Orang
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredTeams.length === 0 && (
          <div className="text-center py-20 text-gray-400">
            Tidak ada tim yang ditemukan.
          </div>
        )}
      </div>
    </div>
  );
}