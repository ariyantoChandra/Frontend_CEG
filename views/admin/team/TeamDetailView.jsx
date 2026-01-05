"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { admin } from "@/core/services/api";
import {
  ArrowLeft,
  CheckCircle2,
  XCircle,
  Loader2,
  AlertCircle,
  User,
  Mail,
  School,
  Image as ImageIcon,
  ShieldCheck,
  ShieldX,
  AlertTriangle,
  Heart,
  X,
  Package,
  Save,
} from "lucide-react";

export default function TeamDetailView() {
  const params = useParams();
  const router = useRouter();
  const teamId = params.teamId;

  // ==================== STATE MANAGEMENT ====================

  const [team, setTeam] = useState(null);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [verifying, setVerifying] = useState(false);
  const [savingNote, setSavingNote] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [adminNote, setAdminNote] = useState("");

  // ==================== API CALLS ====================

  useEffect(() => {
    if (teamId) {
      fetchTeamDetails();
    }
  }, [teamId]);

  const fetchTeamDetails = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await admin.getTeamDetail(teamId);
      if (res.data?.success) {
        const teamData = res.data.data;
        setTeam(teamData);
        setMembers(teamData.members || []);
        setAdminNote(teamData.notes || "");
      } else {
        throw new Error("Data tidak ditemukan");
      }
    } catch (err) {
      setError("Gagal memuat detail tim. Silakan coba lagi.");
      console.error("Error fetching team details:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleVerification = async () => {
    try {
      setVerifying(true);
      
      // Toggle logic
      const newStatus = team.status_pembayaran === "LUNAS" ? "unverified" : "LUNAS";

      const res = await admin.verifyTeam(teamId, newStatus);
      if (res.data?.success) {
        setTeam({
          ...team,
          status_pembayaran: newStatus,
        });
        toast.success(`Status berhasil diubah ke ${newStatus}`);
      }
    } catch (err) {
      toast.error("Gagal mengubah status verifikasi.");
      console.error("Error updating verification:", err);
    } finally {
      setVerifying(false);
    }
  };

  const handleSaveNote = async () => {
    try {
      setSavingNote(true);
      // Panggil API update note
      const res = await admin.manageNotes(teamId, adminNote);
      if (res.data?.success) {
        toast.success("Catatan berhasil disimpan");
      }
    } catch (err) {
      toast.error("Gagal menyimpan catatan.");
      console.error("Error saving note:", err);
    } finally {
      setSavingNote(false);
    }
  };

  const handleImageClick = (imageUrl, title) => {
    setSelectedImage({ url: imageUrl, title });
  };

  const getInitials = (name) => {
    if (!name) return "?";
    const parts = name.split(" ");
    return parts.length >= 2
      ? `${parts[0][0]}${parts[1][0]}`.toUpperCase()
      : parts[0].substring(0, 2).toUpperCase();
  };

  // ==================== RENDER ====================

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-950">
        <div className="text-center">
          <Loader2 className="mx-auto h-12 w-12 animate-spin text-cyan-400" />
          <p className="mt-4 text-zinc-400">Memuat detail tim...</p>
        </div>
      </div>
    );
  }

  if (error && !team) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4 bg-zinc-950">
        <Alert className="max-w-md border-red-500/50 bg-red-500/10">
          <AlertCircle className="h-4 w-4 text-red-400" />
          <AlertDescription className="text-red-400">{error}</AlertDescription>
          <Button
            onClick={() => router.push("/admin")}
            variant="outline"
            className="mt-4 w-full"
          >
            Kembali ke Dashboard
          </Button>
        </Alert>
      </div>
    );
  }

  const isVerified = team?.status_pembayaran === "LUNAS";

  return (
    <div className="relative min-h-screen overflow-hidden px-4 py-12 pb-32 bg-zinc-950">
      {/* Background Effects */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-zinc-950 via-zinc-950 to-zinc-900"></div>
      <div className="absolute left-1/4 top-20 -z-10 h-96 w-96 rounded-full bg-cyan-500/10 blur-3xl"></div>
      <div className="absolute bottom-20 right-1/4 -z-10 h-96 w-96 rounded-full bg-blue-500/10 blur-3xl"></div>

      <div className="relative z-10 mx-auto max-w-7xl">
        {/* Back Button */}
        <Button
          onClick={() => router.push("/admin")}
          variant="ghost"
          className="mb-6 text-zinc-400 hover:text-white"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Kembali ke Dashboard
        </Button>

        {/* A. Header Section - Team Info Card */}
        <Card className="mb-8 border-white/10 bg-zinc-900/40 backdrop-blur-xl">
          <CardHeader>
            <div className="flex flex-col space-y-4 sm:flex-row sm:items-start sm:justify-between sm:space-y-0">
              <div className="space-y-2">
                <div className="flex items-center space-x-3">
                  <CardTitle className="text-3xl font-bold text-white">
                    {team?.nama_tim}
                  </CardTitle>
                  {isVerified ? (
                    <Badge className="border-emerald-500/50 bg-emerald-500/20 text-emerald-400 shadow-lg shadow-emerald-500/20">
                      <CheckCircle2 className="mr-1 h-3 w-3" />
                      VERIFIED
                    </Badge>
                  ) : (
                    <Badge className="border-yellow-500/50 bg-yellow-500/20 text-yellow-400 shadow-lg shadow-yellow-500/20">
                      <XCircle className="mr-1 h-3 w-3" />
                      UNVERIFIED
                    </Badge>
                  )}
                </div>
                <CardDescription className="text-zinc-400">
                  Detail informasi tim dan anggota
                </CardDescription>
              </div>
              
              {/* Tombol Lihat Bukti Bayar */}
              {team?.bukti_pembayaran && (
                  <Button 
                    variant="outline" 
                    className="border-cyan-500 text-cyan-400 hover:bg-cyan-500/10"
                    onClick={() => window.open(`https://api.cegubaya.com/uploads/pembayaran/${team.bukti_pembayaran}`, '_blank')}
                  >
                      <ImageIcon className="mr-2 h-4 w-4"/> Lihat Bukti Bayar
                  </Button>
              )}
            </div>
          </CardHeader>

          <CardContent>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {/* Email */}
              <div className="flex items-center space-x-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-cyan-500/10">
                  <Mail className="h-5 w-5 text-cyan-400" />
                </div>
                <div>
                  <p className="text-xs text-zinc-500">Email Tim</p>
                  <p className="text-sm font-medium text-white">{team?.email}</p>
                </div>
              </div>

              {/* School */}
              <div className="flex items-center space-x-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500/10">
                  <School className="h-5 w-5 text-blue-400" />
                </div>
                <div>
                  <p className="text-xs text-zinc-500">Asal Sekolah</p>
                  <p className="text-sm font-medium text-white">{team?.asal_sekolah}</p>
                </div>
              </div>

              {/* Paket Info */}
              <div className="flex items-center space-x-3">
                 <div className="h-10 w-10 rounded-full bg-orange-500/10 flex items-center justify-center">
                    <Package className="h-5 w-5 text-orange-400"/>
                 </div>
                 <div>
                    <p className="text-xs text-zinc-500">Paket Pendaftaran</p>
                    <div className="flex gap-1 mt-1">
                        <Badge variant="outline" className="text-orange-400 border-orange-500/30 text-[10px]">
                            {team?.paket || "SINGLE"}
                        </Badge>
                        <Badge variant="outline" className="text-zinc-400 border-zinc-500/30 text-[10px]">
                            {team?.kategori_biaya || "NORMAL"}
                        </Badge>
                    </div>
                 </div>
              </div>

              {/* Member Count */}
              <div className="flex items-center space-x-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-500/10">
                  <User className="h-5 w-5 text-purple-400" />
                </div>
                <div>
                  <p className="text-xs text-zinc-500">Jumlah Anggota</p>
                  <p className="text-sm font-medium text-white">{members.length} Orang</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* B. Admin Notes Section */}
        <Card className="mb-8 border-white/10 bg-zinc-900/40 backdrop-blur-xl">
             <CardHeader>
                <CardTitle className="text-xl font-bold text-white">Catatan Admin</CardTitle>
                <CardDescription className="text-zinc-400">Pesan ini akan muncul di dashboard peserta.</CardDescription>
             </CardHeader>
             <CardContent>
                 <div className="flex gap-4 items-start">
                     <Textarea 
                        placeholder="Tulis pesan untuk peserta (misal: Bukti bayar buram, mohon upload ulang)..." 
                        value={adminNote}
                        onChange={(e) => setAdminNote(e.target.value)}
                        className="bg-zinc-950/50 border-white/10 text-white min-h-[100px] flex-1"
                     />
                     <Button 
                        onClick={handleSaveNote} 
                        disabled={savingNote} 
                        className="h-auto py-4 bg-cyan-600 hover:bg-cyan-700"
                     >
                         {savingNote ? <Loader2 className="animate-spin h-5 w-5"/> : <Save className="h-5 w-5"/>}
                     </Button>
                 </div>
             </CardContent>
         </Card>

        {/* C. Members Grid Section */}
        <div className="mb-20">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-white">Anggota Tim</h2>
            <p className="text-sm text-zinc-400">
              Informasi lengkap setiap anggota tim
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {members.map((member) => (
              <Card
                key={member.id}
                className="border-white/10 bg-zinc-900/40 backdrop-blur-xl transition-all hover:border-cyan-500/50 hover:shadow-lg hover:shadow-cyan-500/20"
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-16 w-16 ring-2 ring-cyan-500/30">
                        <AvatarImage
                          src={`https://api.cegubaya.com/uploads/member/pas_foto/${member.pas_foto}`}
                          alt={member.nama_anggota}
                        />
                        <AvatarFallback className="bg-gradient-to-br from-cyan-500 to-blue-500 text-lg font-bold text-white">
                          {getInitials(member.nama_anggota)}
                        </AvatarFallback>
                      </Avatar>

                      <div>
                        <CardTitle className="text-lg text-white">
                          {member.nama_anggota}
                        </CardTitle>
                        <Badge
                          variant="outline"
                          className="mt-1 border-cyan-500/30 text-cyan-400"
                        >
                          Member
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Kartu Pelajar - Clickable */}
                  <div>
                    <p className="mb-2 text-xs font-medium text-zinc-500">
                      Kartu Pelajar
                    </p>
                    <button
                      onClick={() =>
                        handleImageClick(
                          `https://api.cegubaya.com/uploads/member/kartu_pelajar/${member.kartu_pelajar}`,
                          `Kartu Pelajar - ${member.nama_anggota}`
                        )
                      }
                      className="group relative w-full overflow-hidden rounded-lg border border-white/10 bg-zinc-950/50 transition-all hover:border-cyan-500/50 hover:shadow-lg hover:shadow-cyan-500/20"
                    >
                      <div className="aspect-video w-full">
                        <img
                          src={`https://api.cegubaya.com/uploads/member/kartu_pelajar/${member.kartu_pelajar}`}
                          alt={`Kartu Pelajar ${member.nama_anggota}`}
                          className="h-full w-full object-cover transition-transform group-hover:scale-105"
                        />
                      </div>
                      <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-all group-hover:bg-black/60">
                        <ImageIcon className="h-8 w-8 text-white opacity-0 transition-opacity group-hover:opacity-100" />
                      </div>
                    </button>
                  </div>

                  <Separator className="bg-white/10" />

                  {/* Medical Information */}
                  <div className="space-y-3 rounded-lg border border-white/10 bg-zinc-950/30 p-3">
                    <div>
                      <div className="mb-1 flex items-center space-x-2">
                        <AlertTriangle className="h-4 w-4 text-yellow-400" />
                        <p className="text-xs font-medium text-zinc-500">Alergi</p>
                      </div>
                      <p className="text-sm text-white">{member.alergi || "-"}</p>
                    </div>

                    <div>
                      <div className="mb-1 flex items-center space-x-2">
                        <Heart className="h-4 w-4 text-red-400" />
                        <p className="text-xs font-medium text-zinc-500">Penyakit Bawaan</p>
                      </div>
                      <p className="text-sm text-white">{member.penyakit_bawaan || "-"}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* D. Verification Action - Fixed Bottom */}
        <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-white/10 bg-zinc-950/80 p-4 backdrop-blur-xl">
          <div className="mx-auto flex max-w-7xl items-center justify-between">
            <div>
              <p className="text-sm font-medium text-white">
                Status Verifikasi Tim
              </p>
              <p className="text-xs text-zinc-400">
                {isVerified
                  ? "Tim ini sudah diverifikasi dan dapat mengikuti rally"
                  : "Verifikasi tim untuk mengaktifkan akses rally"}
              </p>
            </div>

            <Button
              onClick={handleVerification}
              disabled={verifying}
              className={`min-w-[200px] py-6 text-base font-semibold shadow-lg transition-all ${
                isVerified
                  ? "border-rose-500/50 bg-gradient-to-r from-rose-500 to-red-500 text-white shadow-rose-500/25 hover:shadow-rose-500/40"
                  : "border-emerald-500/50 bg-gradient-to-r from-emerald-500 to-green-500 text-white shadow-emerald-500/25 hover:shadow-emerald-500/40"
              }`}
            >
              {verifying ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Memproses...
                </>
              ) : isVerified ? (
                <>
                  <ShieldX className="mr-2 h-5 w-5" />
                  Batalkan Verifikasi
                </>
              ) : (
                <>
                  <ShieldCheck className="mr-2 h-5 w-5" />
                  Verifikasi Tim Ini
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Image Preview Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-h-[90vh] max-w-4xl w-full flex flex-col items-center">
            <Button
              onClick={() => setSelectedImage(null)}
              variant="ghost"
              className="absolute -top-12 right-0 text-white hover:bg-white/10"
            >
              <X className="h-6 w-6" />
            </Button>
            <div className="rounded-lg border border-white/20 bg-zinc-900/50 p-2 backdrop-blur-xl max-h-[85vh] overflow-hidden">
              <img
                src={selectedImage.url}
                alt={selectedImage.title}
                className="max-h-full max-w-full object-contain rounded-lg"
              />
            </div>
            <p className="mt-4 text-center text-sm text-zinc-400 bg-black/50 px-4 py-2 rounded-full">
                {selectedImage.title}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}