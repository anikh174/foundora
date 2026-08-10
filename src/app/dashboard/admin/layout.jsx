"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { FullPageLoader } from "@/components/ui/Spinner";

export default function AdminGuard({ children }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user && user.role !== "admin") {
      router.replace("/unauthorized");
    }
  }, [loading, user, router]);

  if (loading || !user || user.role !== "admin") {
    return <FullPageLoader label="Checking access..." />;
  }

  return children;
}
