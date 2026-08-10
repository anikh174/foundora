"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { FullPageLoader } from "@/components/ui/Spinner";

export default function SupporterGuard({ children }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user && user.role !== "supporter") {
      router.replace("/unauthorized");
    }
  }, [loading, user, router]);

  if (loading || !user || user.role !== "supporter") {
    return <FullPageLoader label="Checking access..." />;
  }

  return children;
}
