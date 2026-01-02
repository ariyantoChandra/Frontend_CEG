"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/core/services/api";
import { Eye, EyeOff } from "lucide-react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useDispatch } from "react-redux";
import { setToken } from "@/core/feature/token/tokenSlice";
import { toast } from "sonner";
import { setUser } from "@/core/feature/user/userSlice";
import { setRole } from "@/core/feature/role/roleSlice";
import Image from 'next/image';
import Navbar from "@/components/shared/Dashboard/navbar";
import Link from "next/link";

const loginSchema = Yup.object({
  nama: Yup.string().required("Nama harus diisi"),
  password: Yup.string().required("Password harus diisi"),
});

const backgroundPath = "/Asset/Background Landscape.png";
const welcomePath = "/Asset/LOGIN.png";

export default function LoginPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState(false);

  const formik = useFormik({
    initialValues: { nama: "", password: "" },
    validationSchema: loginSchema,
    onSubmit: async (values) => {
      const credentials = `${values.nama}:${values.password}`;
      const base64Credentials = typeof window !== 'undefined' ? btoa(credentials) : '';
      const data = { nama: values.nama, password: values.password };

      try {
        const response = await auth.login(data, base64Credentials);
        const access_token = response?.data?.data?.token;
        const username = response?.data?.data?.nama_tim;
        const role = response?.data?.data?.role;

        if (access_token) {
          dispatch(setToken({ token: access_token }));
          dispatch(setUser(username));
          dispatch(setRole(role));
          toast.success(`Selamat datang, ${username || 'User'}!`);
          if (role === 'PESERTA') router.push('/');
          else if (role === 'ADMIN') router.push('/admin');
          else if (role === 'PENPOS') router.push('/pos');
        }
      } catch (error) {
        toast.error(error?.response?.data?.message || 'Login gagal');
      }
    },
  });

  const { handleSubmit, values, touched, errors } = formik;

  return (
    <div className="relative h-screen w-full font-sans overflow-hidden">
      {/* 1. Background Image */}
      <div className="absolute inset-0 -z-10">
        <Image 
          src={backgroundPath} 
          alt="Background" 
          fill 
          className="object-cover"
          priority
        />
      </div>

      {/* 2. Navbar */}
      <Navbar />

      {/* 3. Main Content - Disesuaikan agar TIDAK SCROLL dan LEBIH NAIK */}
      <main className="relative z-10 flex flex-col items-center justify-start px-4"
            style={{ height: "calc(100vh - 64px)", marginTop: "64px" }}>
        
        {/* Container Utama dengan padding atas kecil agar naik */}
        <div className="flex flex-col items-center w-full max-w-4xl pt-4 md:pt-10">
          
          {/* Tulisan Welcome - Margin diperkecil agar rapat dengan form */}
          <div className="mb-2 md:mb-4"> 
            <Image 
              src={welcomePath} 
              alt="Welcome" 
              width={400} 
              height={150} 
              className="drop-shadow-lg w-[280px] md:w-[400px] h-auto"
            />
          </div>

          {/* Form Container */}
          <div className="w-full max-w-[320px] md:max-w-md">
            <form onSubmit={handleSubmit} className="space-y-3 md:space-y-4">
              
              {/* USERNAME */}
              <div className="group space-y-1">
                <label className="block text-teal-900 font-bold text-base md:text-lg ml-2">
                  Username
                </label>
                <input
                  type="text"
                  name="nama"
                  value={values.nama}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="Masukkan username"
                  className="w-full bg-white/40 border-none rounded-2xl py-3 md:py-4 px-6 
                            text-teal-900 placeholder:text-teal-800/60 
                            focus:ring-2 focus:ring-teal-500 backdrop-blur-sm shadow-inner"
                />
                {touched.nama && errors.nama && (
                  <p className="text-red-500 text-xs mt-1 ml-2 font-semibold">{errors.nama}</p>
                )}
              </div>

              {/* PASSWORD */}
              <div className="group space-y-1">
                <label className="block text-teal-900 font-bold text-base md:text-lg ml-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={values.password}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="Masukkan password"
                    className="w-full bg-white/40 border-none rounded-2xl py-3 md:py-4 px-6 pr-12
                              text-teal-900 placeholder:text-teal-800/60 
                              focus:ring-2 focus:ring-teal-500 backdrop-blur-sm shadow-inner"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-teal-800"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {touched.password && errors.password && (
                  <p className="text-red-500 text-xs mt-1 ml-2 font-semibold">{errors.password}</p>
                )}
              </div>

              {/* Submit Button */}
              <div className="flex justify-center pt-2 md:pt-4">
                <button 
                  type="submit"
                  className="bg-teal-800 hover:bg-teal-900 text-white px-12 py-3 rounded-2xl font-bold text-lg md:text-xl shadow-lg backdrop-blur-md transition-all active:scale-95 w-full md:w-auto"
                >
                  Login
                </button>
              </div>

              {/* Submit Button & Register Link */}
              <div className="flex flex-col items-center gap-4 pt-2 md:pt-4">
                {/* Tambahan Link Daftar */}
                <p className="text-black drop-shadow-md font-medium text-sm md:text-base">
                  Belum punya akun?{" "}
                  <Link 
                    href="/register" 
                    className="text-black-300 font-bold hover:text-teal-400 hover:underline transition-colors drop-shadow-sm"
                  >
                    Daftar di sini
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}