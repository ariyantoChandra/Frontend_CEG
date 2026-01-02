"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Shield, Lock, User, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { auth } from "@/core/services/api"; // Import API

export default function AdminRegistrationPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Panggil API registerAdmin yang baru kita buat
      const res = await auth.registerAdmin(formData);
      
      // Cek response
      // (Sesuaikan dengan format axios response backend Anda)
      if (res.data && res.data.success) {
        alert("Admin berhasil dibuat! Silakan Login.");
        router.push("/login"); // Lempar ke halaman login biasa
      } else {
        alert("Gagal: " + (res.data?.message || "Terjadi kesalahan"));
      }
    } catch (error) {
      console.error(error);
      alert("Error: " + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 p-4">
      <div className="w-full max-w-md bg-gray-800 border border-gray-700 p-8 rounded-2xl shadow-2xl">
        
        <div className="flex flex-col items-center gap-4 mb-8">
          <div className="bg-red-600 p-3 rounded-full">
            <Shield size={32} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white uppercase tracking-wider">Admin Access</h1>
          <p className="text-gray-400 text-sm text-center">
            Halaman ini tersembunyi. Hanya untuk panitia inti CEG 2026.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-gray-300 text-sm font-bold ml-1">Username Admin</label>
            <div className="relative">
              <User className="absolute left-4 top-3.5 text-gray-500" size={20} />
              <Input 
                placeholder="Masukkan username..." 
                className="pl-12 bg-gray-900/50 border-gray-600 text-white h-12 rounded-xl focus:ring-red-500"
                value={formData.username}
                onChange={(e) => setFormData({...formData, username: e.target.value})}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-gray-300 text-sm font-bold ml-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-3.5 text-gray-500" size={20} />
              <Input 
                type="password"
                placeholder="Rahasia..." 
                className="pl-12 bg-gray-900/50 border-gray-600 text-white h-12 rounded-xl focus:ring-red-500"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                required
              />
            </div>
          </div>

          <Button 
            type="submit" 
            disabled={loading}
            className="w-full h-12 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl"
          >
            {loading ? <Loader2 className="animate-spin" /> : "DAFTARKAN ADMIN"}
          </Button>
        </form>

      </div>
    </div>
  );
}   