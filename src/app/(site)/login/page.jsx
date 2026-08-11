"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Lock, Mail, ArrowRight } from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "@/context/AuthContext";
import { Spinner } from "@/components/ui/Spinner";
import GoogleButton from "@/components/auth/GoogleButton";
import AuthShell from "@/components/auth/AuthShell";

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const nextErrors = {};
    if (!form.email.trim()) nextErrors.email = "Email is required";
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) nextErrors.email = "Enter a valid email address";
    if (!form.password) nextErrors.password = "Password is required";
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    try {
      const user = await login(form.email, form.password);
      toast.success(`Welcome back, ${user.name}!`);
      router.push(`/dashboard/${user.role}`);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Login failed");
    } finally {
      setSubmitting(false);
    }
  };

  const inputBase =
    "w-full pl-11 pr-11 py-3 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none text-sm transition bg-white";

  return (
    <AuthShell>
      <div className="bg-white rounded-3xl shadow-card border border-slate-100 p-8 md:p-10 animate-fade-up">
        <div className="flex flex-col items-center text-center">
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">Welcome back</h1>
          <p className="mt-1.5 text-sm text-slate-500">Log in to continue supporting great ideas</p>
        </div>

        <div className="mt-8">
          <GoogleButton label="Continue with Google" />
        </div>

        <div className="my-6 flex items-center gap-3">
          <div className="flex-1 h-px bg-slate-100" />
          <span className="text-xs font-medium text-slate-400">or continue with email</span>
          <div className="flex-1 h-px bg-slate-100" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
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
                placeholder="••••••••"
                className={inputBase}
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

          <button
            type="submit"
            disabled={submitting}
            className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-emerald-600 text-white text-sm font-bold hover:bg-emerald-700 transition shadow-lg shadow-emerald-600/20 disabled:opacity-60"
          >
            {submitting ? <Spinner className="w-4 h-4" color="text-current" /> : "Log in"}
            {!submitting && <ArrowRight className="w-4 h-4" />}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-500">
          New to Fundora?{" "}
          <Link href="/register" className="font-bold text-emerald-600 hover:text-emerald-700">
            Create an account
          </Link>
        </p>
      </div>
    </AuthShell>
  );
}
