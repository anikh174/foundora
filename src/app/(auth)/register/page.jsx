"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Camera, Eye, EyeOff, Lock, Mail, Rocket, User, UserRound } from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "@/context/AuthContext";
import { Spinner } from "@/components/ui/Spinner";
import GoogleButton from "@/components/auth/GoogleButton";
import AuthLayout from "@/components/auth/AuthLayout";
import { uploadImage } from "@/lib/imgbb";

const roles = [
  {
    value: "supporter",
    icon: UserRound,
    title: "Supporter",
    text: "Fund campaigns",
    bonus: "50 bonus credits",
  },
  {
    value: "creator",
    icon: Rocket,
    title: "Creator",
    text: "Launch campaigns",
    bonus: "20 bonus credits",
  },
];

function getPasswordStrength(password) {
  if (!password) return 0;
  let score = 0;
  if (password.length >= 6) score += 1;
  if (password.length >= 10) score += 1;
  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score += 1;
  if (/\d/.test(password) || /[^A-Za-z0-9]/.test(password)) score += 1;
  return score;
}

const strengthMeta = [
  { label: "", color: "bg-slate-200" },
  { label: "Weak", color: "bg-rose-500" },
  { label: "Fair", color: "bg-orange-500" },
  { label: "Good", color: "bg-amber-500" },
  { label: "Strong", color: "bg-emerald-500" },
];

function RegisterForm() {
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

  const strength = getPasswordStrength(form.password);

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
    "w-full rounded-xl border border-slate-200 bg-slate-50/60 py-3 pl-11 pr-11 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10";

  return (
    <AuthLayout>
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
          Create your account
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          Join as a supporter or launch your first campaign — it takes under a minute.
        </p>
      </div>

      <div className="mt-8">
        <GoogleButton label="Sign up with Google" />
      </div>

      <div className="my-7 flex items-center gap-3">
        <div className="h-px flex-1 bg-slate-200" />
        <span className="text-xs font-medium text-slate-400">or sign up with email</span>
        <div className="h-px flex-1 bg-slate-200" />
      </div>

      <form onSubmit={handleSubmit} noValidate className="space-y-5">
        <div className="flex justify-center">
          <div className="relative">
            <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-emerald-100 to-emerald-50 ring-4 ring-white shadow-lg shadow-slate-900/10">
              {imagePreview ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={imagePreview} alt="Profile preview" className="h-full w-full object-cover" />
              ) : (
                <User className="h-8 w-8 text-emerald-400" />
              )}
            </div>
            <label className="absolute -bottom-1 -right-1 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-emerald-600 text-white shadow-lg shadow-emerald-600/30 transition hover:bg-emerald-700">
              <Camera className="h-4 w-4" />
              <span className="sr-only">Upload profile photo</span>
              <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
            </label>
            {uploadingImage && (
              <div className="absolute inset-0 flex items-center justify-center rounded-full bg-white/70">
                <Spinner className="w-5 h-5" />
              </div>
            )}
          </div>
        </div>

        <div>
          <label htmlFor="register-name" className="text-xs font-semibold uppercase tracking-wide text-slate-600">
            Full name
          </label>
          <div className="relative mt-1.5">
            <User className="pointer-events-none absolute left-3.5 top-1/2 w-4 h-4 -translate-y-1/2 text-slate-400" />
            <input
              id="register-name"
              type="text"
              autoComplete="name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Your full name"
              className={inputBase}
            />
          </div>
          {errors.name && (
            <p role="alert" className="mt-1.5 text-xs font-medium text-rose-600">
              {errors.name}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="register-email" className="text-xs font-semibold uppercase tracking-wide text-slate-600">
            Email
          </label>
          <div className="relative mt-1.5">
            <Mail className="pointer-events-none absolute left-3.5 top-1/2 w-4 h-4 -translate-y-1/2 text-slate-400" />
            <input
              id="register-email"
              type="email"
              autoComplete="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="you@example.com"
              className={inputBase}
            />
          </div>
          {errors.email && (
            <p role="alert" className="mt-1.5 text-xs font-medium text-rose-600">
              {errors.email}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="register-password" className="text-xs font-semibold uppercase tracking-wide text-slate-600">
            Password
          </label>
          <div className="relative mt-1.5">
            <Lock className="pointer-events-none absolute left-3.5 top-1/2 w-4 h-4 -translate-y-1/2 text-slate-400" />
            <input
              id="register-password"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder="At least 6 characters"
              className={inputBase}
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-600"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {errors.password ? (
            <p role="alert" className="mt-1.5 text-xs font-medium text-rose-600">
              {errors.password}
            </p>
          ) : (
            form.password && (
              <div className="mt-2 flex items-center gap-2">
                <div className="flex flex-1 gap-1">
                  {[1, 2, 3, 4].map((step) => (
                    <span
                      key={step}
                      className={`h-1 flex-1 rounded-full ${
                        step <= strength ? strengthMeta[strength].color : "bg-slate-200"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-[11px] font-semibold text-slate-500">
                  {strengthMeta[strength].label}
                </span>
              </div>
            )
          )}
        </div>

        <div>
          <span className="text-xs font-semibold uppercase tracking-wide text-slate-600">
            I want to join as
          </span>
          <div className="mt-1.5 grid grid-cols-2 gap-3">
            {roles.map(({ value, icon: Icon, title, text, bonus }) => {
              const active = role === value;
              return (
                <button
                  key={value}
                  type="button"
                  onClick={() => setRole(value)}
                  aria-pressed={active}
                  className={`rounded-xl border p-4 text-left transition ${
                    active
                      ? "border-emerald-500 bg-emerald-50/60 ring-4 ring-emerald-500/10"
                      : "border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <Icon className={`h-5 w-5 ${active ? "text-emerald-600" : "text-slate-400"}`} />
                  <p className="mt-2 text-sm font-bold text-slate-900">{title}</p>
                  <p className="mt-0.5 text-xs text-slate-500">{text}</p>
                  <p
                    className={`mt-2 inline-flex rounded-full px-2 py-0.5 text-[11px] font-bold ${
                      active ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    {bonus}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-emerald-600/25 transition-all hover:from-emerald-700 hover:to-emerald-600 active:scale-[0.99] disabled:opacity-60 disabled:active:scale-100"
        >
          {submitting ? <Spinner className="w-4 h-4" color="text-current" /> : "Create my account"}
        </button>

        <p className="text-center text-xs leading-relaxed text-slate-400">
          By creating an account you agree to Fundora&apos;s Terms of Use and Privacy Policy.
        </p>
      </form>

      <p className="mt-6 text-center text-sm text-slate-500">
        Already have an account?{" "}
        <Link href="/login" className="font-bold text-emerald-600 transition hover:text-emerald-700">
          Log in
        </Link>
      </p>
    </AuthLayout>
  );
}

export default function RegisterPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <Spinner className="w-7 h-7" />
        </div>
      }
    >
      <RegisterForm />
    </Suspense>
  );
}
