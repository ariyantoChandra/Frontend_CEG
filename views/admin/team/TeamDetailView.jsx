"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Textarea } from "@/components/ui/textarea"; // Pastikan component ini ada
import { toast } from "sonner"; // Optional: Untuk notifikasi
import { admin } from "@/core/services/api"; // Import API service
import {
  ArrowLeft, CheckCircle2, XCircle, Loader2, AlertCircle, User, Mail, School,
  Image as ImageIcon, ShieldCheck, ShieldX, AlertTriangle, Heart, X, Package, Save
} from "lucide-react";

export default function TeamDetailView() {
  const params = useParams();
  const router = useRouter();
  const teamId = params.teamId;

  const [team, setTeam] = useState(null);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [verifying, setVerifying] = useState(false);
  const [savingNote, setSavingNote] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [adminNote, setAdminNote] = useState("");

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
      setError("Gagal memuat detail tim.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleVerification = async () => {
    try {
      setVerifying(true);
      // Logic Toggle Status
      const newStatus = team.status_pembayaran === "LUNAS" ? "unverified" : "LUNAS";
      
      // Panggil API verifyTeam
      const res = await admin.verifyTeam(teamId, newStatus);
      if(res.data?.success) {
          setTeam({ ...team, status_pembayaran: newStatus });
          toast.success(`Status berhasil diubah ke ${newStatus}`);
      }
    } catch (err) {
      toast.error("Gagal verifikasi tim");
    } finally {
      setVerifying(false);
    }
  };

  const handleSaveNote = async () => {
      try {
          setSavingNote(true);
          const res = await admin.manageNotes(teamId, adminNote); // Pastikan API ini ada
          if(res.data?.success) {
              toast.success("Catatan berhasil disimpan");
          }
      } catch(err) {
          toast.error("Gagal menyimpan catatan");
      } finally {
          setSavingNote(false);
      }
  };

  const getInitials = (name) => {
    if (!name) return "?";
    return name.substring(0, 2).toUpperCase();
  };

  if (loading) return <div className="flex min-h-screen items-center justify-center"><Loader2 className="animate-spin text-cyan-400 h-10 w-10" /></div>;

  const isVerified = team?.status_pembayaran === "LUNAS";

  return (
    <div className="relative min-h-screen overflow-hidden px-4 py-12 pb-32 bg-zinc-950">
       {/* ... Background Effects tetap sama ... */}
       <div className="absolute inset-0 -z-10 bg-gradient-to-br from-zinc-950 via-zinc-950 to-zinc-900"></div>

       <div className="relative z-10 mx-auto max-w-7xl">
         <Button onClick={() => router.push("/admin")} variant="ghost" className="mb-6 text-zinc-400 hover:text-white">
            <ArrowLeft className="mr-2 h-4 w-4" /> Kembali
         </Button>

         {/* HEADER INFO */}
         <Card className="mb-8 border-white/10 bg-zinc-900/40 backdrop-blur-xl">
            <CardHeader>
               <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-3xl font-bold text-white mb-2">{team?.nama_tim}</CardTitle>
                    <div className="flex gap-2">
                        {isVerified ? 
                            <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/50"><CheckCircle2 className="w-3 h-3 mr-1"/> VERIFIED</Badge> : 
                            <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/50"><XCircle className="w-3 h-3 mr-1"/> UNVERIFIED</Badge>
                        }
                    </div>
                  </div>
                  {/* BUKTI PEMBAYARAN BUTTON */}
                  {team?.bukti_pembayaran && (
                      <Button variant="outline" className="border-cyan-500 text-cyan-400 hover:bg-cyan-500/10"
                        onClick={() => window.open(`https://api.cegubaya.com/uploads/pembayaran/${team.bukti_pembayaran}`, '_blank')}>
                          <ImageIcon className="mr-2 h-4 w-4"/> Lihat Bukti Bayar
                      </Button>
                  )}
               </div>
            </CardHeader>
            <CardContent>
               <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                  <div className="flex items-center space-x-3">
                     <div className="h-10 w-10 rounded-full bg-cyan-500/10 flex items-center justify-center"><Mail className="h-5 w-5 text-cyan-400"/></div>
                     <div><p className="text-xs text-zinc-500">Email</p><p className="text-sm font-medium text-white">{team?.email}</p></div>
                  </div>
                  <div className="flex items-center space-x-3">
                     <div className="h-10 w-10 rounded-full bg-blue-500/10 flex items-center justify-center"><School className="h-5 w-5 text-blue-400"/></div>
                     <div><p className="text-xs text-zinc-500">Sekolah</p><p className="text-sm font-medium text-white">{team?.asal_sekolah}</p></div>
                  </div>
                  {/* INFO PAKET (BARU) */}
                  <div className="flex items-center space-x-3">
                     <div className="h-10 w-10 rounded-full bg-orange-500/10 flex items-center justify-center"><Package className="h-5 w-5 text-orange-400"/></div>
                     <div>
                        <p className="text-xs text-zinc-500">Paket</p>
                        <div className="flex gap-1 mt-1">
                            <Badge variant="outline" className="text-orange-400 border-orange-500/30 text-[10px]">{team?.paket || "SINGLE"}</Badge>
                            <Badge variant="outline" className="text-zinc-400 border-zinc-500/30 text-[10px]">{team?.kategori_biaya || "NORMAL"}</Badge>
                        </div>
                     </div>
                  </div>
                  <div className="flex items-center space-x-3">
                     <div className="h-10 w-10 rounded-full bg-purple-500/10 flex items-center justify-center"><User className="h-5 w-5 text-purple-400"/></div>
                     <div><p className="text-xs text-zinc-500">Anggota</p><p className="text-sm font-medium text-white">{members.length} Orang</p></div>
                  </div>
               </div>
            </CardContent>
         </Card>

         {/* ADMIN NOTES SECTION (BARU) */}
         <Card className="mb-8 border-white/10 bg-zinc-900/40 backdrop-blur-xl">
             <CardHeader><CardTitle className="text-xl font-bold text-white">Catatan Admin</CardTitle></CardHeader>
             <CardContent>
                 <div className="flex gap-4">
                     <Textarea 
                        placeholder="Tulis pesan untuk peserta (misal: Bukti bayar buram)..." 
                        value={adminNote}
                        onChange={(e) => setAdminNote(e.target.value)}
                        className="bg-zinc-950/50 border-white/10 text-white min-h-[100px]"
                     />
                     <Button onClick={handleSaveNote} disabled={savingNote} className="h-auto bg-cyan-600 hover:bg-cyan-700">
                         {savingNote ? <Loader2 className="animate-spin"/> : <Save/>}
                     </Button>
                 </div>
                 <p className="text-xs text-zinc-500 mt-2">*Pesan ini akan muncul di dashboard peserta.</p>
             </CardContent>
         </Card>

         {/* MEMBER LIST */}
         <div className="grid gap-6 lg:grid-cols-3 mb-20">
            {members.map((member) => (
                <Card key={member.id} className="border-white/10 bg-zinc-900/40 backdrop-blur-xl">
                    <CardHeader>
                        <div className="flex items-center gap-3">
                            <Avatar><AvatarImage src={`https://api.cegubaya.com/uploads/member/pas_foto/${member.pas_foto}`} /><AvatarFallback>{getInitials(member.nama_anggota)}</AvatarFallback></Avatar>
                            <div><CardTitle className="text-white text-lg">{member.nama_anggota}</CardTitle><p className="text-sm text-cyan-400">Member</p></div>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {/* Detail Member Cards (Sama seperti sebelumnya, pastikan path gambar benar) */}
                        <div className="space-y-2">
                             <p className="text-xs text-zinc-500">Kartu Pelajar:</p>
                             <div className="aspect-video w-full bg-black/50 rounded overflow-hidden cursor-pointer"
                                  onClick={() => setSelectedImage({ url: `https://api.cegubaya.com/uploads/member/kartu_pelajar/${member.kartu_pelajar}`, title: member.nama_anggota })}>
                                <img src={`https://api.cegubaya.com/uploads/member/kartu_pelajar/${member.kartu_pelajar}`} className="w-full h-full object-cover hover:scale-105 transition-transform"/>
                             </div>
                        </div>
                    </CardContent>
                </Card>
            ))}
         </div>

         {/* FOOTER VERIFICATION */}
         <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-white/10 bg-zinc-950/80 p-4 backdrop-blur-xl">
             <div className="mx-auto flex max-w-7xl items-center justify-between">
                 <div><p className="text-white font-bold">Aksi Verifikasi</p><p className="text-zinc-400 text-xs">Ubah status pembayaran tim ini</p></div>
                 <Button onClick={handleVerification} disabled={verifying}
                    className={isVerified ? "bg-red-600 hover:bg-red-700" : "bg-emerald-600 hover:bg-emerald-700"}>
                    {verifying ? <Loader2 className="animate-spin mr-2"/> : isVerified ? <ShieldX className="mr-2"/> : <ShieldCheck className="mr-2"/>}
                    {isVerified ? "Batalkan Verifikasi" : "Verifikasi Tim"}
                 </Button>
             </div>
         </div>

         {/* IMAGE MODAL */}
         {selectedImage && (
             <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4" onClick={() => setSelectedImage(null)}>
                 <img src={selectedImage.url} className="max-h-[90vh] max-w-full rounded"/>
             </div>
         )}
       </div>
    </div>
  );
}