"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useApp } from "@/lib/app-context";
import { UserRole } from "@/lib/types";

export default function AuthGuard({
  children,
  allowedRoles = ["customer"],
}: {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { currentUser, isLoadingAuth } = useApp();

  useEffect(() => {
    if (isLoadingAuth) return;

    if (!currentUser) {
      const baseLogin = allowedRoles.includes("mechanic") && !allowedRoles.includes("customer")
        ? "/login?role=mechanic"
        : "/login";
      const sep = baseLogin.includes("?") ? "&" : "?";

      router.replace(
        `${baseLogin}${sep}redirect=${encodeURIComponent(pathname)}&message=${encodeURIComponent(
          "Please log in to continue."
        )}`
      );
    }
  }, [currentUser, isLoadingAuth, router, pathname, allowedRoles]);

  if (isLoadingAuth) {
    return (
      <div className="py-16 text-center text-xs text-wire-500 flex flex-col items-center justify-center gap-2">
        <span className="w-5 h-5 border-2 border-wire-900 border-t-transparent rounded-full animate-spin"></span>
        <span>Checking authentication...</span>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="py-16 text-center text-xs text-wire-500">
        <span>Please log in to continue. Redirecting...</span>
      </div>
    );
  }

  return <>{children}</>;
}
