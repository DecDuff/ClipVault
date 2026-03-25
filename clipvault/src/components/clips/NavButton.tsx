"use client";

import { useSession, signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export function NavButton({ href, label }: { href: string; label: string }) {
  const { data: session, status } = useSession();
  const router = useRouter();

  const handleClick = () => {
    if (status === "loading") return;

    if (status === "authenticated") {
      router.push(href);
    } else {
      // If the session isn't found, force a sign-in first
      signIn();
    }
  };

  return (
    <button
      onClick={handleClick}
      className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg transition-all"
    >
      {status === "loading" ? "Checking..." : label}
    </button>
  );
}