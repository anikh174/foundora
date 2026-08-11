"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff, Lock, Mail, User, Camera, UserRound, Rocket, Sparkles } from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "@/context/AuthContext";
import { Spinner } from "@/components/ui/Spinner";
import GoogleButton from "@/components/auth/GoogleButton";
import AuthShell from "@/components/auth/AuthShell";
import { uploadImage } from "@/lib/imgbb";

export default function RegisterPage() {
  const { register } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialRole = searchParams.get("role") === "creator" ? "creator" : "supporter";

  const [role, setRole] = useState(initialRole);
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imagePreview, setImagePreview] = useState("");
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const nextErrors = {};
    if (!form.name.trim()) nextErrors.name = "Full name is required";
    else if (form.name.trim().length < 3) nextErrors.name = "Name must be at least 3 characters";
    if (!form.email.trim()) nextErrors.email = "Email is required";
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) nextErrors.email = "Enter a valid email address";
    if (!form.password) nextErrors.password = "Password is required";
    else if (form.password.length < 6) nextErrors.password = "Password must be at least 6 characters";
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleImageChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingImage(true);
    try {
      const url = await uploadImage(file);
      setImagePreview(url);
      toast.success("Profile image uploaded");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    try {
      const user = await register({
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
        image: imagePreview,
        role,
      });
      const bonus = role === "creator" ? 20 : 50;
      toast.success(
        `Account created! Welcome, ${user.name}. You received ${bonus} bonus credits.`
      );
      router.push(`/dashboard/${user.role}`);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Registration failed");
    } finally {
      setSubmitting(false);
    }
  };

  const inputBase =
    "w-full pl-11 py-3 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none text-sm transition bg-white";

  return (
    <AuthShell>
      <div className="flex flex-col items-center text-center">
        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold">
          <Sparkles className="w-3.5 h-3.5" /> Start in under a minute
        </span>
        <h1 className="mt-4 text-[1.7rem] font-extrabold tracking-tight text-slate-900">Create your account</h1>
        <p className="mt-1.5 text-sm text-slate-500">Join as a supporter or launch your first campaign</p>
      </div>

      <div className="mt-8">
        <GoogleButton label="Sign up with Google" />
      </div>

      <div className="my-6 flex items-center gap-3">
        <div className="flex-1 h-px bg-slate-200" />
        <span className="text-xs font-medium text-slate-400">or sign up with email</span>
        <div className="flex-1 h-px bg-slate-200" />
      </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex items-center justify-center">
              <div className="relative">
                <div className="w-20 h-20 rounded-2xl bg-slate-100 overflow-hidden flex items-center justify-center">
                  {imagePreview ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={imagePreview} alt="Profile preview" className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-8 h-8 text-slate-400" />
                  )}
                </div>
                <label className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center cursor-pointer shadow-lg shadow-emerald-600/30 hover:bg-emerald-700 transition">
                  <Camera className="w-4 h-4" />
                  <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                </label>
                {uploadingImage && (
                  <div className="absolute inset-0 rounded-2xl bg-white/70 flex items-center justify-center">
                    <Spinner className="w-5 h-5" />
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Full name</label>
              <div className="relative mt-1.5">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Your full name"
                  className={inputBase}
                />
              </div>
              {errors.name && <p className="mt-1.5 text-xs text-rose-600">{errors.name}</p>}
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Email</label>
              <div className="relative mt-1.5">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="you@example.com"
                  className={inputBase}
                />
              </div>
              {errors.email && <p className="mt-1.5 text-xs text-rose-600">{errors.email}</p>}
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Password</label>
              <div className="relative mt-1.5">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder="At least 6 characters"
                  className={`${inputBase} pr-11`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <p className="mt-1.5 text-xs text-rose-600">{errors.password}</p>}
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                I want to join as
              </label>
              <div className="mt-1.5 grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setRole("supporter")}
                  className={`p-4 rounded-2xl border-2 text-left transition ${
                    role === "supporter"
                      ? "border-emerald-500 bg-emerald-50"
                      : "border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <UserRound className={`w-5 h-5 ${role === "supporter" ? "text-emerald-600" : "text-slate-400"}`} />
                  <p className="mt-2 text-sm font-bold text-slate-900">Supporter</p>
                  <p className="mt-0.5 text-xs text-slate-500">Fund campaigns • get 50 credits</p>
                </button>
                <button
                  type="button"
                  onClick={() => setRole("creator")}
                  className={`p-4 rounded-2xl border-2 text-left transition ${
                    role === "creator"
                      ? "border-emerald-500 bg-emerald-50"
                      : "border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <Rocket className={`w-5 h-5 ${role === "creator" ? "text-emerald-600" : "text-slate-400"}`} />
                  <p className="mt-2 text-sm font-bold text-slate-900">Creator</p>
                  <p className="mt-0.5 text-xs text-slate-500">Launch campaigns • get 20 credits</p>
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 text-white text-sm font-bold hover:from-emerald-700 hover:to-emerald-600 active:scale-[0.99] transition-all shadow-lg shadow-emerald-600/25 disabled:opacity-60 disabled:active:scale-100"
            >
              {submitting ? <Spinner className="w-4 h-4" color="text-current" /> : "Create my account"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-500">
            Already have an account?{" "}
            <Link href="/login" className="font-bold text-emerald-600 hover:text-emerald-700">
              Log in
            </Link>
          </p>
    </AuthShell>
  );
}
