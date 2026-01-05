"use client";
import React, { useState } from "react";
import axios from "axios";

export default function TestBundlePage() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // INI DATA DUMMY (Pura-puranya input dari form banyak tim)
  // Kita hardcode biar gampang ngetesnya
  const teamsDataDummy = [
    {
      nama_tim: "Tim Alpha Bundle",
      password: "123",
      email: "alpha@test.com",
      asal_sekolah: "SMA 1 Surabaya",
      no_wa: "081234567890",
      id_line: "alpha_line",
      members: [] // Kosongin dulu membernya biar simpel
    },
    {
      nama_tim: "Tim Beta Bundle",
      password: "123",
      email: "beta@test.com",
      asal_sekolah: "SMA 2 Surabaya",
      no_wa: "081234567891",
      id_line: "beta_line",
      members: []
    },
    {
      nama_tim: "Tim Charlie Bundle",
      password: "123",
      email: "charlie@test.com",
      asal_sekolah: "SMA 3 Surabaya",
      no_wa: "081234567892",
      id_line: "charlie_line",
      members: []
    }
  ];

  const handleRegister = async () => {
    if (!file) {
      alert("Pilih file bukti bayar dulu!");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      // 1. BUAT FORM DATA (Amplop Pengiriman)
      const formData = new FormData();

      // 2. MASUKKAN 1 FILE (Kuncinya disini, cuma append sekali)
      formData.append("bukti_pembayaran", file);

      // 3. MASUKKAN DATA 3 TIM SEBAGAI JSON STRING
      // Backend akan membacanya lewat: JSON.parse(req.body.teams_data)
      formData.append("teams_data", JSON.stringify(teamsDataDummy));

      // 4. KIRIM KE BACKEND (Sesuaikan URL backendmu)
      const response = await axios.post("http://localhost:5000/api/auth/register", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("Response:", response.data);
      setMessage("✅ BERHASIL! Cek Terminal Backend & Database.");
    } catch (error) {
      console.error("Error:", error);
      setMessage("❌ GAGAL: " + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "50px", fontFamily: "sans-serif" }}>
      <h1>Test Register Bundle (Tanpa Postman)</h1>
      
      <div style={{ marginBottom: "20px", padding: "20px", border: "1px solid #ccc" }}>
        <h3>1. Pilih Satu Bukti Bayar (Untuk Rame-rame)</h3>
        <input 
          type="file" 
          onChange={(e) => setFile(e.target.files[0])} 
          accept="image/*"
        />
      </div>

      <div style={{ marginBottom: "20px" }}>
        <h3>2. Data Tim yang akan didaftarkan (Hardcoded):</h3>
        <ul>
          {teamsDataDummy.map((t, i) => (
            <li key={i}>
                <b>{t.nama_tim}</b> - {t.email}
            </li>
          ))}
        </ul>
      </div>

      <button 
        onClick={handleRegister} 
        disabled={loading}
        style={{ padding: "10px 20px", fontSize: "16px", cursor: "pointer" }}
      >
        {loading ? "Sedang Mengirim..." : "KIRIM SEKARANG 🚀"}
      </button>

      {message && <h3 style={{ marginTop: "20px" }}>{message}</h3>}
    </div>
  );
}