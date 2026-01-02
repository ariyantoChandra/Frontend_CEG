"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

// Pastikan path import komponen UI ini sesuai dengan struktur project kamu
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Shield,
  Users,
  Activity,
  School,
  CheckCircle2,
  XCircle,
  Loader2,
  AlertCircle,
  Play,
  Pause,
  TrendingUp,
} from "lucide-react";

export default function HomePageAdmin() {
  const router = useRouter();

  // ==================== STATE MANAGEMENT ====================

  // Rally Status
  const [rallyStatus, setRallyStatus] = useState(false); // false = BELUM MULAI, true = MULAI
  const [updatingStatus, setUpdatingStatus] = useState(false);

  // Teams Data
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Statistics
  const [stats, setStats] = useState({
    totalTeams: 0,
    verifiedTeams: 0,
    unverifiedTeams: 0,
  });

  // ==================== API CALLS ====================

  // Fetch Rally Status & Teams
  useEffect(() => {
    fetchRallyStatus();
    fetchTeams();
  }, []);

  const fetchRallyStatus = async () => {
    try {
      // TODO: Ganti dengan endpoint API Express kamu yang sebenarnya
      // const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/rally/status`);
      // const data = await response.json();
      // setRallyStatus(data.data.isStarted);

      // MOCK DATA (Simulasi)
      await new Promise((resolve) => setTimeout(resolve, 500));
      setRallyStatus(false); // Default: Not Started
    } catch (err) {
      console.error("Error fetching rally status:", err);
    }
  };

  // Fetch Teams
  const fetchTeams = async () => {
    try {
      setLoading(true);
      setError(null);

      // TODO: Ganti dengan endpoint API Express kamu yang sebenarnya
      // const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/teams`);
      // if (!response.ok) throw new Error('Failed to fetch teams');
      // const data = await response.json();
      // setTeams(data.data);

      // MOCK DATA - Replace with actual API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const mockTeams = [
        {
          id: 1,
          nama_tim: "Team Alpha",
          asal_sekolah: "SMA Negeri 1 Jakarta",
          status_pembayaran: "LUNAS",
          jumlah_anggota: 3,
        },
        {
          id: 2,
          nama_tim: "Team Beta",
          asal_sekolah: "SMA Negeri 2 Bandung",
          status_pembayaran: "BELUM LUNAS",
          jumlah_anggota: 3,
        },
        {
          id: 3,
          nama_tim: "Team Gamma",
          asal_sekolah: "SMA Negeri 3 Surabaya",
          status_pembayaran: "LUNAS",
          jumlah_anggota: 3,
        },
        {
          id: 4,
          nama_tim: "Team Delta",
          asal_sekolah: "SMA Negeri 4 Medan",
          status_pembayaran: "LUNAS",
          jumlah_anggota: 3,
        },
        {
          id: 5,
          nama_tim: "Team Epsilon",
          asal_sekolah: "SMA Negeri 5 Yogyakarta",
          status_pembayaran: "BELUM LUNAS",
          jumlah_anggota: 3,
        },
        {
          id: 6,
          nama_tim: "Team Zeta",
          asal_sekolah: "SMA Negeri 6 Semarang",
          status_pembayaran: "LUNAS",
          jumlah_anggota: 3,
        },
      ];

      setTeams(mockTeams);

      // Calculate statistics
      const verified = mockTeams.filter(
        (t) => t.status_pembayaran === "LUNAS"
      ).length;
      setStats({
        totalTeams: mockTeams.length,
        verifiedTeams: verified,
        unverifiedTeams: mockTeams.length - verified,
      });
    } catch (err) {
      setError("Gagal memuat data tim. Silakan coba lagi.");
      console.error("Error fetching teams:", err);
    } finally {
      setLoading(false);
    }
  };

  // Update Rally Status
  const handleStatusToggle = async (newStatus) => {
    try {
      setUpdatingStatus(true);

      // TODO: Ganti dengan endpoint API Express kamu yang sebenarnya
      // const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/rally/status`, {
      //   method: 'PUT',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ isStarted: newStatus }),
      // });
      // if (!response.ok) throw new Error('Failed to update status');

      // MOCK API CALL
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setRallyStatus(newStatus);
      console.log(
        `Rally status updated to: ${newStatus ? "STARTED" : "NOT STARTED"}`
      );
    } catch (err) {
      console.error("Error updating rally status:", err);
      setError("Gagal mengubah status rally. Silakan coba lagi.");
    } finally {
      setUpdatingStatus(false);
    }
  };

  // Navigate to Team Detail
  const handleTeamClick = (teamId) => {
    router.push(`/admin/team/${teamId}`);
  };

  // ==================== RENDER ====================

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <Loader2 className="mx-auto h-12 w-12 animate-spin text-cyan-400" />
          <p className="mt-4 text-zinc-400">Memuat dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden px-4 py-8">
      {/* Background Effects (Opsional: sesuaikan jika sudah ada global layout) */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-zinc-950 via-zinc-950 to-zinc-900"></div>
      <div className="absolute left-1/4 top-20 -z-10 h-96 w-96 rounded-full bg-cyan-500/10 blur-3xl"></div>
      <div className="absolute bottom-20 right-1/4 -z-10 h-96 w-96 rounded-full bg-blue-500/10 blur-3xl"></div>

      <div className="relative z-10 mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <div className="mb-4 inline-flex items-center space-x-2 rounded-full border border-cyan-500/20 bg-cyan-500/10 px-4 py-1.5 backdrop-blur-sm">
            <Shield className="h-4 w-4 text-cyan-400" />
            <span className="text-sm font-medium text-cyan-400">
              Admin Dashboard
            </span>
          </div>

          <h1 className="mb-2 text-4xl font-bold text-white">
            Rally Management
          </h1>
          <p className="text-zinc-400">
            Kelola status rally dan pantau tim terdaftar
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <Alert className="mb-6 border-red-500/50 bg-red-500/10">
            <AlertCircle className="h-4 w-4 text-red-400" />
            <AlertDescription className="text-red-400">
              {error}
            </AlertDescription>
          </Alert>
        )}

        {/* Statistics Cards */}
        <div className="mb-8 grid gap-6 sm:grid-cols-3">
          <Card className="border-white/10 bg-zinc-900/40 backdrop-blur-xl">
            <CardHeader className="pb-3">
              <CardDescription className="text-zinc-400">
                Total Tim
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-4xl font-bold text-white">
                  {stats.totalTeams}
                </span>
                <Users className="h-8 w-8 text-cyan-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-white/10 bg-zinc-900/40 backdrop-blur-xl">
            <CardHeader className="pb-3">
              <CardDescription className="text-zinc-400">
                Verified
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-4xl font-bold text-emerald-400">
                  {stats.verifiedTeams}
                </span>
                <CheckCircle2 className="h-8 w-8 text-emerald-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-white/10 bg-zinc-900/40 backdrop-blur-xl">
            <CardHeader className="pb-3">
              <CardDescription className="text-zinc-400">
                Unverified
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-4xl font-bold text-yellow-400">
                  {stats.unverifiedTeams}
                </span>
                <XCircle className="h-8 w-8 text-yellow-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* A. Rally Status Control */}
        <Card className="mb-8 border-white/10 bg-zinc-900/40 backdrop-blur-xl">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center space-x-2 text-2xl text-white">
                  <Activity className="h-6 w-6 text-cyan-400" />
                  <span>Control Center</span>
                </CardTitle>
                <CardDescription className="mt-2 text-zinc-400">
                  Kontrol status rally secara real-time
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent>
            <div className="flex flex-col space-y-6 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
              {/* Status Display */}
              <div className="flex items-center space-x-4">
                <div
                  className={`flex h-16 w-16 items-center justify-center rounded-full ${
                    rallyStatus
                      ? "bg-emerald-500/20 ring-2 ring-emerald-500/50"
                      : "bg-zinc-800/50 ring-2 ring-zinc-700/50"
                  }`}
                >
                  {rallyStatus ? (
                    <Play className="h-8 w-8 text-emerald-400" />
                  ) : (
                    <Pause className="h-8 w-8 text-zinc-500" />
                  )}
                </div>

                <div>
                  <p className="text-sm text-zinc-400">Status Rally</p>
                  <p
                    className={`text-2xl font-bold ${
                      rallyStatus
                        ? "text-emerald-400 drop-shadow-[0_0_12px_rgba(52,211,153,0.5)]"
                        : "text-zinc-500"
                    }`}
                  >
                    {rallyStatus ? "MULAI" : "BELUM MULAI"}
                  </p>
                </div>
              </div>

              {/* Toggle Switch */}
              <div className="flex items-center space-x-4 rounded-xl border border-white/10 bg-zinc-950/50 p-4">
                <Label
                  htmlFor="rally-status"
                  className="cursor-pointer text-sm font-medium text-zinc-300"
                >
                  {updatingStatus ? "Memperbarui..." : "Ubah Status"}
                </Label>
                <Switch
                  id="rally-status"
                  checked={rallyStatus}
                  onCheckedChange={handleStatusToggle}
                  disabled={updatingStatus}
                  className="data-[state=checked]:bg-emerald-500"
                />
              </div>
            </div>

            {/* Status Info */}
            <div className="mt-6 rounded-lg border border-white/10 bg-zinc-950/30 p-4">
              <div className="flex items-start space-x-3">
                <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-cyan-400" />
                <p className="text-sm text-zinc-400">
                  {rallyStatus
                    ? "Rally sedang berlangsung. Tim dapat mulai bermain di setiap pos."
                    : "Rally belum dimulai. Aktifkan untuk memulai permainan."}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* B. Team Management Section */}
        <div className="mb-8">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white">Tim Terdaftar</h2>
              <p className="text-sm text-zinc-400">
                Klik pada kartu untuk melihat detail tim
              </p>
            </div>
            <Button
              onClick={fetchTeams}
              variant="outline"
              className="border-cyan-500/30 bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20"
            >
              <TrendingUp className="mr-2 h-4 w-4" />
              Refresh
            </Button>
          </div>

          {/* Teams Grid */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {teams.map((team) => {
              const isVerified = team.status_pembayaran === "LUNAS";

              return (
                <Card
                  key={team.id}
                  onClick={() => handleTeamClick(team.id)}
                  className="group cursor-pointer border-white/10 bg-zinc-900/40 backdrop-blur-xl transition-all hover:border-cyan-500/50 hover:bg-zinc-900/60 hover:shadow-lg hover:shadow-cyan-500/20"
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-xl font-bold text-white transition-colors group-hover:text-cyan-400">
                        {team.nama_tim}
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
                  </CardHeader>

                  <CardContent className="space-y-3">
                    {/* School Info */}
                    <div className="flex items-center space-x-2 text-sm text-zinc-400">
                      <School className="h-4 w-4 text-cyan-400" />
                      <span>{team.asal_sekolah}</span>
                    </div>

                    {/* Members Count */}
                    <div className="flex items-center space-x-2 text-sm text-zinc-400">
                      <Users className="h-4 w-4 text-cyan-400" />
                      <span>{team.jumlah_anggota} Anggota</span>
                    </div>

                    {/* Hover Indicator */}
                    <div className="mt-4 flex items-center justify-end space-x-2 text-xs text-zinc-500 opacity-0 transition-opacity group-hover:opacity-100">
                      <span>Lihat Detail</span>
                      <div className="flex h-4 w-4 items-center justify-center rounded-full bg-cyan-500/20">
                        <span className="text-cyan-400">→</span>
                      </div>
                    </div>
                  </CardContent>

                  {/* Bottom Glow Effect on Hover */}
                  <div className="h-1 w-full bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent opacity-0 transition-opacity group-hover:opacity-100"></div>
                </Card>
              );
            })}
          </div>

          {/* Empty State */}
          {teams.length === 0 && !loading && (
            <Card className="border-white/10 bg-zinc-900/40 backdrop-blur-xl">
              <CardContent className="py-16 text-center">
                <Users className="mx-auto mb-4 h-16 w-16 text-zinc-600" />
                <h3 className="mb-2 text-xl font-semibold text-white">
                  Tidak Ada Tim
                </h3>
                <p className="text-zinc-400">Belum ada tim yang terdaftar</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
