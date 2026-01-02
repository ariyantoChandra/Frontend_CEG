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
} from "lucide-react";

export default function TeamDetailView() {
  const params = useParams();
  const router = useRouter();

  // NOTE: Diambil dari params.teamId karena nama foldernya [teamId]
  const teamId = params.teamId;

  // ==================== STATE MANAGEMENT ====================

  const [team, setTeam] = useState(null);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [verifying, setVerifying] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

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

      // TODO: Replace with your actual Express API endpoint
      // const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/teams/${teamId}`);
      // if (!response.ok) throw new Error('Failed to fetch team details');
      // const data = await response.json();
      // setTeam(data.data.team);
      // setMembers(data.data.members);

      // MOCK DATA - Replace with actual API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const mockTeamData = {
        id: parseInt(teamId),
        nama_tim: "Team Alpha",
        email: "team.alpha@example.com",
        asal_sekolah: "SMA Negeri 1 Jakarta",
        status_pembayaran: "LUNAS",
        bukti_pembayaran: "https://via.placeholder.com/400x300",
        created_at: "2024-01-15T10:00:00Z",
      };

      const mockMembers = [
        {
          id: 1,
          nama_anggota: "John Doe",
          email: "john.doe@example.com",
          no_telp: "081234567890",
          pas_foto: "https://i.pravatar.cc/150?img=12",
          kartu_pelajar:
            "https://via.placeholder.com/400x300?text=Student+ID+1",
          alergi: "Tidak ada",
          penyakit_bawaan: "Tidak ada",
          role: "Leader",
        },
        {
          id: 2,
          nama_anggota: "Jane Smith",
          email: "jane.smith@example.com",
          no_telp: "081234567891",
          pas_foto: "https://i.pravatar.cc/150?img=5",
          kartu_pelajar:
            "https://via.placeholder.com/400x300?text=Student+ID+2",
          alergi: "Seafood",
          penyakit_bawaan: "Asma",
          role: "Member",
        },
        {
          id: 3,
          nama_anggota: "Bob Johnson",
          email: "bob.johnson@example.com",
          no_telp: "081234567892",
          pas_foto: "https://i.pravatar.cc/150?img=33",
          kartu_pelajar:
            "https://via.placeholder.com/400x300?text=Student+ID+3",
          alergi: "Tidak ada",
          penyakit_bawaan: "Tidak ada",
          role: "Member",
        },
      ];

      setTeam(mockTeamData);
      setMembers(mockMembers);
    } catch (err) {
      setError("Gagal memuat detail tim. Silakan coba lagi.");
      console.error("Error fetching team details:", err);
    } finally {
      setLoading(false);
    }
  };

  // Handle Verification Toggle
  const handleVerification = async () => {
    try {
      setVerifying(true);
      setError(null);

      const newStatus =
        team.status_pembayaran === "LUNAS" ? "BELUM LUNAS" : "LUNAS";

      // TODO: Replace with your actual Express API endpoint
      // const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/teams/${teamId}/verify`, {
      //   method: 'PUT',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ status_pembayaran: newStatus }),
      // });
      // if (!response.ok) throw new Error('Failed to update verification status');

      // MOCK API CALL
      await new Promise((resolve) => setTimeout(resolve, 1500));

      setTeam({
        ...team,
        status_pembayaran: newStatus,
      });

      console.log(`Team verification status updated to: ${newStatus}`);
    } catch (err) {
      setError("Gagal mengubah status verifikasi. Silakan coba lagi.");
      console.error("Error updating verification:", err);
    } finally {
      setVerifying(false);
    }
  };

  // Handle Image Preview
  const handleImageClick = (imageUrl, title) => {
    setSelectedImage({ url: imageUrl, title });
  };

  // Get Initials for Avatar Fallback
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
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <Loader2 className="mx-auto h-12 w-12 animate-spin text-cyan-400" />
          <p className="mt-4 text-zinc-400">Memuat detail tim...</p>
        </div>
      </div>
    );
  }

  if (error && !team) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
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
    <div className="relative min-h-screen overflow-hidden px-4 py-12 pb-32">
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

        {/* Error Alert */}
        {error && (
          <Alert className="mb-6 border-red-500/50 bg-red-500/10">
            <AlertCircle className="h-4 w-4 text-red-400" />
            <AlertDescription className="text-red-400">
              {error}
            </AlertDescription>
          </Alert>
        )}

        {/* A. Header Section - Team Info Card */}
        <Card className="mb-8 border-white/10 bg-zinc-900/40 backdrop-blur-xl">
          <CardHeader>
            <div className="flex flex-col space-y-4 sm:flex-row sm:items-start sm:justify-between sm:space-y-0">
              <div className="space-y-2">
                <div className="flex items-center space-x-3">
                  <CardTitle className="text-3xl font-bold text-white">
                    {team?.nama_tim}
                  </CardTitle>
                  {/* Status Badge */}
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
            </div>
          </CardHeader>

          <CardContent>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {/* Email */}
              <div className="flex items-center space-x-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-cyan-500/10">
                  <Mail className="h-5 w-5 text-cyan-400" />
                </div>
                <div>
                  <p className="text-xs text-zinc-500">Email Tim</p>
                  <p className="text-sm font-medium text-white">
                    {team?.email}
                  </p>
                </div>
              </div>

              {/* School */}
              <div className="flex items-center space-x-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500/10">
                  <School className="h-5 w-5 text-blue-400" />
                </div>
                <div>
                  <p className="text-xs text-zinc-500">Asal Sekolah</p>
                  <p className="text-sm font-medium text-white">
                    {team?.asal_sekolah}
                  </p>
                </div>
              </div>

              {/* Member Count */}
              <div className="flex items-center space-x-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-500/10">
                  <User className="h-5 w-5 text-purple-400" />
                </div>
                <div>
                  <p className="text-xs text-zinc-500">Jumlah Anggota</p>
                  <p className="text-sm font-medium text-white">
                    {members.length} Orang
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* B. Members Grid Section */}
        <div className="mb-8">
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
                      {/* Member Avatar */}
                      <Avatar className="h-16 w-16 ring-2 ring-cyan-500/30">
                        <AvatarImage
                          src={member.pas_foto}
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
                          {member.role || "Member"}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Contact Info */}
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2 text-sm">
                      <Mail className="h-4 w-4 text-zinc-500" />
                      <span className="text-zinc-400">{member.email}</span>
                    </div>
                    {member.no_telp && (
                      <div className="flex items-center space-x-2 text-sm">
                        <span className="text-zinc-500">📱</span>
                        <span className="text-zinc-400">{member.no_telp}</span>
                      </div>
                    )}
                  </div>

                  <Separator className="bg-white/10" />

                  {/* Student ID Card - Clickable */}
                  <div>
                    <p className="mb-2 text-xs font-medium text-zinc-500">
                      Kartu Pelajar
                    </p>
                    <button
                      onClick={() =>
                        handleImageClick(
                          member.kartu_pelajar,
                          `Kartu Pelajar - ${member.nama_anggota}`
                        )
                      }
                      className="group relative w-full overflow-hidden rounded-lg border border-white/10 bg-zinc-950/50 transition-all hover:border-cyan-500/50 hover:shadow-lg hover:shadow-cyan-500/20"
                    >
                      <div className="aspect-video w-full">
                        <img
                          src={member.kartu_pelajar}
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
                        <p className="text-xs font-medium text-zinc-500">
                          Alergi
                        </p>
                      </div>
                      <p className="text-sm text-white">
                        {member.alergi || "Tidak ada"}
                      </p>
                    </div>

                    <div>
                      <div className="mb-1 flex items-center space-x-2">
                        <Heart className="h-4 w-4 text-red-400" />
                        <p className="text-xs font-medium text-zinc-500">
                          Penyakit Bawaan
                        </p>
                      </div>
                      <p className="text-sm text-white">
                        {member.penyakit_bawaan || "Tidak ada"}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* C. Verification Action - Fixed Bottom */}
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
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-h-[90vh] max-w-4xl">
            <Button
              onClick={() => setSelectedImage(null)}
              variant="ghost"
              className="absolute -top-12 right-0 text-white hover:bg-white/10"
            >
              <X className="h-6 w-6" />
            </Button>
            <div className="rounded-lg border border-white/20 bg-zinc-900/50 p-2 backdrop-blur-xl">
              <img
                src={selectedImage.url}
                alt={selectedImage.title}
                className="max-h-[80vh] w-auto rounded-lg"
              />
              <p className="mt-2 text-center text-sm text-zinc-400">
                {selectedImage.title}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
