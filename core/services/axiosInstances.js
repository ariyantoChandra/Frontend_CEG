import axios from "axios";
import { setupInterceptorsTo } from "./interceptors";

export const createAxiosInstance = (
    options = {},
    axiosConfig = {}
) => {
    // === PERUBAHAN DI SINI ===
    // Ganti localhost dengan IP Public Server Anda.
    // (Port 5000 harus dipastikan terbuka di firewall server)
    
    // Opsi 1: Hardcode (Paling Cepat & Pasti Jalan)
    const baseUrl = "https://api.cegubaya.com"; 
    
    // Opsi 2: Kalau mau pakai .env (Pastikan di .env file isinya benar)
    // const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://103.163.138.117:5000";

    const instance = axios.create({
        baseURL: `${baseUrl}`, 
        headers: {
            // "Content-Type" DIHAPUS agar otomatis mendeteksi FormData (Upload Gambar)
            "Cache-Control": "no-cache, no-store, must-revalidate",
            "Pragma": "no-cache",
            "Expires": "0",
        },
        ...axiosConfig,
    });

    setupInterceptorsTo(instance, {
        disableErrorToast: true,
        ...options,
    });

    return instance;
};