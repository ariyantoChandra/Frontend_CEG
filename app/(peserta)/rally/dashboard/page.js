"use client";
import { useEffect, useState } from "react";
import Navbar from "@/components/shared/Dashboard/navbar";
import { createAxiosInstance } from "@/core/services/axiosInstances";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, CheckCircle2, XCircle, FileText, Package } from "lucide-react";
import Image from "next/image";

export default function DashboardPeserta() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const axiosInstance = createAxiosInstance();
        // Menggunakan endpoint getUserInfo yang sudah diupdate
        const response = await axiosInstance.get("/api/user/get-user-info");
        setData(response.data.data);
      } catch (error) {
        console.error("Error fetching user info:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="min-h-screen relative w-full font-sans">
      {/* Background */}
      <div className="fixed inset-0 -z-10">
        <Image src="/Asset/Background Landscape.png" alt="Background" fill className="object-cover" priority />
      </div>
      
      <Navbar />

      <div className="container mx-auto px-4 pt-32 flex justify-center pb-20">
        {loading ? (
          <div className="bg-white/50 backdrop-blur-md p-8 rounded-3xl flex flex-col items-center">
             <Loader2 className="animate-spin text-teal-800 h-10 w-10 mb-2" />
             <p className="text-teal-900 font-bold">Memuat Data Tim...</p>
          </div>
        ) : data ? (
          <Card className="w-full max-w-2xl bg-white/40 backdrop-blur-xl border border-white/60 shadow-2xl rounded-[40px] overflow-hidden">
            
            {/* Header Card */}
            <CardHeader className="bg-teal-800/10 border-b border-teal-800/10 text-center py-10">
              <div className="mx-auto bg-white/50 p-3 rounded-full w-fit mb-4 shadow-sm">
                 <Image src="/Asset/Maskot.jpg" alt="Profile" width={80} height={80} className="rounded-full object-cover" />
              </div>
              <CardTitle className="text-4xl font-black text-teal-900 uppercase tracking-tight">
                {data.nama_tim}
              </CardTitle>
              <p className="text-teal-800 font-medium opacity-80">{data.email}</p>
            </CardHeader>

            <CardContent className="p-8 space-y-8">
              
              {/* STATUS UTAMA */}
              <div className="flex flex-col items-center gap-4">
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-teal-900/60">Status Pendaftaran</span>
                {data.status_pembayaran === "LUNAS" || data.status_pembayaran === "verified" ? (
                  <Badge className="bg-green-500 hover:bg-green-600 text-white px-8 py-3 text-xl rounded-2xl gap-2 shadow-lg shadow-green-500/20">
                    <CheckCircle2 size={24} /> TERVERIFIKASI
                  </Badge>
                ) : (
                  <div className="flex flex-col items-center gap-2">
                    <Badge className="bg-yellow-500 hover:bg-yellow-600 text-white px-8 py-3 text-xl rounded-2xl gap-2 shadow-lg shadow-yellow-500/20">
                      <XCircle size={24} /> MENUNGGU VERIFIKASI
                    </Badge>
                    <p className="text-xs text-center text-teal-900/70 max-w-xs">
                       Admin sedang memverifikasi bukti pembayaran Anda. Silakan cek berkala.
                    </p>
                  </div>
                )}
              </div>

              {/* GRID INFO */}
              <div className="grid grid-cols-2 gap-4">
                 <div className="bg-white/40 p-5 rounded-2xl border border-white/30 text-center">
                    <div className="flex justify-center mb-2 text-teal-700"><FileText size={24}/></div>
                    <p className="text-xs font-bold text-teal-800/60 uppercase tracking-wider mb-1">Asal Sekolah</p>
                    <p className="font-bold text-teal-900 text-lg leading-tight">{data.asal_sekolah}</p>
                 </div>
                 <div className="bg-white/40 p-5 rounded-2xl border border-white/30 text-center">
                    <div className="flex justify-center mb-2 text-teal-700"><Package size={24}/></div>
                    <p className="text-xs font-bold text-teal-800/60 uppercase tracking-wider mb-1">Paket</p>
                    <p className="font-bold text-teal-900 text-lg">{data.paket || "SINGLE"}</p>
                 </div>
              </div>

              {/* ADMIN NOTES */}
              {data.notes && (
                <div className="bg-blue-100/80 border-l-8 border-blue-500 p-6 rounded-r-2xl shadow-sm">
                    <div className="flex items-center gap-2 mb-2">
                        <div className="bg-blue-500 p-1 rounded-full"><FileText size={12} className="text-white"/></div>
                        <p className="text-xs font-bold text-blue-800 uppercase tracking-wider">Pesan dari Admin:</p>
                    </div>
                    <p className="text-blue-900 font-medium leading-relaxed">{data.notes}</p>
                </div>
              )}

            </CardContent>
          </Card>
        ) : (
           <div className="text-center">
             <h2 className="text-2xl font-bold text-teal-900">Data tidak ditemukan</h2>
             <p className="text-teal-800">Silakan login ulang.</p>
           </div>
        )}
      </div>
    </div>
  );
}