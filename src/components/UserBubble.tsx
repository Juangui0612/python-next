"use client";
import { useEffect, useState, useRef } from "react";
import { getCookie, deleteCookie } from "cookies-next";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/navigation";

type TokenPayload = { username?: string; name?: string; email?: string };

function initials(nameOrUsername: string | null) {
  if (!nameOrUsername) return "U";
  const parts = nameOrUsername.split(" ");
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}

export default function UserBubble() {
  const [username, setUsername] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);
  const router = useRouter();

  useEffect(() => {
    const token = getCookie("ap_token") as string | undefined;
    if (!token) return;
    try {
      const payload = jwtDecode<TokenPayload>(token);
      setUsername(payload.username ?? payload.name ?? null);
    } catch {
      setUsername(null);
    }
  }, []);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    window.addEventListener("click", onClick);
    return () => window.removeEventListener("click", onClick);
  }, []);

  function handleLogout() {
    deleteCookie("ap_token");
    router.push("/login");
  }

  return (
    <div ref={ref} className="relative flex items-center">
      {/* Avatar */}
      <button
        onClick={() => setOpen(v => !v)}
        className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold shadow hover:bg-blue-700 transition"
      >
        {initials(username)}
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 top-12 w-56 bg-white text-black rounded-xl shadow-xl border z-50">
          {/* Header */}
          <div className="px-4 py-3 border-b">
            <p className="text-xs text-gray-500">Conectado</p>
            <p className="font-semibold truncate">{username ?? "Usuario"}</p>
          </div>

          {/* Actions */}
          <div className="flex flex-col py-2">
            <button
              onClick={() => {
                setOpen(false);
                router.push("/profile");
              }}
              className="px-4 py-2 text-left hover:bg-gray-100 transition"
            >
              👤 Ver perfil
            </button>

            <button
              onClick={handleLogout}
              className="px-4 py-2 text-left text-red-600 hover:bg-red-50 transition"
            >
              🚪 Cerrar sesión
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
