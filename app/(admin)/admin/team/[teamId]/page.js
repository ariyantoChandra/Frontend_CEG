"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { admin } from "@/core/services/api";
import {
  Loader2,
  ArrowLeft,
  ExternalLink,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";

// --- PERBAIKAN 1: HELPER URL ---
// Kita butuh parameter 'type' untuk menentukan folder sub-nya
const getImageUrl = (filename, type) => {
  if (!filename) return "/placeholder.png"; // Gambar default jika kosong
  
  // Ganti localhost:5000 jika sudah deploy, atau gunakan environment variable
  const BASE_URL = "https://api.cegubaya.com"; 
  
  let folder = "";
  
  switch (type) {
    case "bukti_pembayaran":
      folder = "pembayaran";
      break;
    case "pas_foto":
      folder = "member/pas_foto";
      break;
    case "kartu_pelajar":
      folder = "member/kartu_pelajar";
      break;
    case "follow_ceg":
      folder = "member/follow_ceg";
      break;
    case "follow_tk":
      folder = "member/follow_tk";
      break;
    default:
      folder = ""; // Fallback
  }

  return `${BASE_URL}/public/uploads/${folder}/${filename}`;
};

export default function TeamDetailPage() {
  const { teamId } = useParams();
  const router = useRouter();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    fetchDetail();
  }, [teamId]);

  const fetchDetail = async () => {
    try {
      const res = await admin.getTeamDetail(teamId);
      if (res.data && res.data.data) {
        setData(res.data.data);
      }
    } catch (error) {
      alert("Gagal ambil detail tim");
    } finally {
      setLoading(false);
    }
  };

  const handleVerification = async (newStatus) => {
    if (!confirm(`Ubah status menjadi ${newStatus}?`)) return;
    setProcessing(true);
    try {
      await admin.verifyTeam(teamId, newStatus);
      fetchDetail(); 
    } catch (error) {
      alert("Gagal update status");
    } finally {
      setProcessing(false);
    }
  };

  if (loading)
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader2 className="animate-spin" />
      </div>
    );
  if (!data)
    return <div className="text-center p-10">Data tidak ditemukan</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-10">
      <div className="max-w-5xl mx-auto space-y-8">
        <Button variant="ghost" onClick={() => router.back()} className="gap-2 text-black">
          <ArrowLeft size={20} /> Kembali ke Dashboard
        </Button>

        {/* HEADER SECTION (Sama seperti kodemu) */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h1 className="text-3xl font-black text-teal-900 uppercase">
              {data.nama_tim}
            </h1>
            <p className="text-gray-500 font-medium">{data.asal_sekolah}</p>
            <div className={`mt-2 inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-bold ${data.status_pembayaran === "verified" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
              {data.status_pembayaran === "verified" ? <CheckCircle size={16} /> : <XCircle size={16} />}
              {data.status_pembayaran?.toUpperCase()}
            </div>
          </div>

          <div className="flex gap-3">
            {data.status_pembayaran !== "verified" && (
              <Button className="bg-green-600 hover:bg-green-700 text-white" onClick={() => handleVerification("verified")} disabled={processing}>
                {processing ? <Loader2 className="animate-spin" /> : "Verifikasi Sekarang"}
              </Button>
            )}
            {data.status_pembayaran === "verified" && (
              <Button variant="destructive" onClick={() => handleVerification("unverified")} disabled={processing}>
                {processing ? <Loader2 className="animate-spin" /> : "Batalkan Verifikasi"}
              </Button>
            )}
          </div>
        </div>

        {/* --- PERBAIKAN 2: BUKTI PEMBAYARAN --- */}
        <Card>
          <CardHeader>
            <CardTitle>Bukti Pembayaran</CardTitle>
          </CardHeader>
          <CardContent>
            {data.bukti_pembayaran ? (
              <div className="relative h-64 w-full md:w-96 rounded-xl overflow-hidden border">
                <Image
                  // Tambahkan parameter kedua: "bukti_pembayaran"
                  src={getImageUrl(data.bukti_pembayaran, "bukti_pembayaran")}
                  alt="Bukti Bayar"
                  fill
                  className="object-contain bg-gray-100"
                />
                <a
                  href={getImageUrl(data.bukti_pembayaran, "bukti_pembayaran")}
                  target="_blank"
                  className="absolute bottom-2 right-2 bg-black/50 text-white p-2 rounded-lg text-xs hover:bg-black/70 flex items-center gap-1"
                >
                  <ExternalLink size={12} /> Buka Asli
                </a>
              </div>
            ) : (
              <p className="text-red-500 italic">Belum ada bukti pembayaran.</p>
            )}
          </CardContent>
        </Card>

        {/* --- PERBAIKAN 3: LIST ANGGOTA --- */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-teal-900">Data Anggota</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {data.members.map((m, i) => (
              <Card key={i} className="overflow-hidden">
                <div className="h-48 bg-gray-200 relative">
                  {m.pas_foto ? (
                    <Image
                      // Tambahkan parameter: "pas_foto"
                      src={getImageUrl(m.pas_foto, "pas_foto")}
                      alt={m.nama_anggota}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-400">No Photo</div>
                  )}
                </div>
                <CardContent className="p-4 space-y-3">
                  <h3 className="font-bold text-lg leading-tight">{m.nama_anggota}</h3>
                  <div className="text-sm space-y-1 text-gray-600">
                    <p>Pola Makan: <span className="font-semibold text-teal-800">{m.pola_makan}</span></p>
                    <p>Alergi: {m.alergi}</p>
                    <p>Penyakit: {m.penyakit_bawaan}</p>
                  </div>
                  
                  {/* UPDATE LINK DOWNLOAD/VIEW */}
                  <div className="flex flex-col gap-2 pt-2">
                    {m.pas_foto && (
                      <a href={getImageUrl(m.pas_foto, "pas_foto")} target="_blank" className="text-xs text-blue-600 hover:underline flex items-center gap-1">
                        <ExternalLink size={12} /> Lihat Pas Foto
                      </a>
                    )}
                    {m.kartu_pelajar && (
                      <a href={getImageUrl(m.kartu_pelajar, "kartu_pelajar")} target="_blank" className="text-xs text-blue-600 hover:underline flex items-center gap-1">
                        <ExternalLink size={12} /> Lihat Kartu Pelajar
                      </a>
                    )}
                    {m.bukti_follow_ceg && (
                      <a href={getImageUrl(m.bukti_follow_ceg, "follow_ceg")} target="_blank" className="text-xs text-blue-600 hover:underline flex items-center gap-1">
                        <ExternalLink size={12} /> Lihat Bukti Follow IG CEG
                      </a>
                    )}
                    {m.bukti_follow_tkubaya && (
                      <a href={getImageUrl(m.bukti_follow_tkubaya, "follow_tk")} target="_blank" className="text-xs text-blue-600 hover:underline flex items-center gap-1">
                        <ExternalLink size={12} /> Lihat Bukti Follow IG TKUBAYA
                      </a>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}