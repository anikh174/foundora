"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Spinner } from "@/components/ui/Spinner";
import { useAuth } from "@/context/AuthContext";
import toast from "react-hot-toast";

const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

export default function GoogleButton({ label = "Continue with Google" }) {
  const { googleSignIn } = useAuth();
  const router = useRouter();
  const buttonRef = useRef(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!GOOGLE_CLIENT_ID || !window.google || window.google.accounts === undefined) return;

    const id = window.google.accounts.id;

    const handleCredential = async (response) => {
      setLoading(true);
      try {
        const user = await googleSignIn(response.credential);
        toast.success(`Welcome back, ${user.name}!`);
        router.push(`/dashboard/${user.role}`);
      } catch (error) {
        toast.error(error?.response?.data?.message || "Google sign-in failed");
      } finally {
        setLoading(false);
      }
    };

    id.initialize({
      client_id: GOOGLE_CLIENT_ID,
      callback: handleCredential,
      ux_mode: "popup",
    });

    if (buttonRef.current) {
      id.renderButton(buttonRef.current, {
        theme: "outline",
        size: "large",
        shape: "pill",
        text: "continue_with",
        width: "100%",
      });
    }
  }, [googleSignIn, router]);

  useEffect(() => {
    if (GOOGLE_CLIENT_ID && !window.google) {
      const script = document.createElement("script");
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      script.onload = () => window.dispatchEvent(new Event("google-loaded"));
      document.body.appendChild(script);
    }
  }, []);

  useEffect(() => {
    const onLoad = () => {
      if (buttonRef.current && window.google) {
        window.google.accounts.id.renderButton(buttonRef.current, {
          theme: "outline",
          size: "large",
          shape: "pill",
          text: "continue_with",
          width: "100%",
        });
      }
    };
    window.addEventListener("google-loaded", onLoad);
    return () => window.removeEventListener("google-loaded", onLoad);
  }, []);

  return (
    <div className="relative">
      <div ref={buttonRef} className="w-full overflow-hidden rounded-xl" />
      {loading && (
        <div className="absolute inset-0 bg-white/70 rounded-xl flex items-center justify-center">
          <Spinner className="w-5 h-5" />
        </div>
      )}
    </div>
  );
}
