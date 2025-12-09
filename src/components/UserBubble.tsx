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
    } catch (err) {
      console.error("Token inválido:", err);
    }
  }, []);

  // Close on outside click
  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    window.addEventListener("click", onClick);
    return () => window.removeEventListener("click", onClick);
  }, []);

  function handleLogout() {
    // borra cookie y redirige
    deleteCookie("ap_token");
    // si usas otro nombre para la cookie, borrarlo también
    router.push("/login");
  }

  return (
    <div ref={ref} className="relative flex items-center">
      {/* Circle / bubble */}
      <button
        onClick={() => setOpen(v => !v)}
        className="relative -mb-6 mr-3 w-10 h-10 rounded-full bg-slate-800 text-white flex items-center justify-center text-sm font-semibold shadow hover:opacity-90"
        aria-label="User menu"
      >
        {initials(username)}
        {/* small online dot (optional) */}
        <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-green-400 ring-2 ring-white" />
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 mt-2 w-48 bg-white border rounded-md shadow-lg z-50">
          <div className="px-4 py-3 border-b">
            <div className="text-sm text-gray-700">Conectado como</div>
            <div className="font-semibold text-gray-900 truncate">{username ?? "Usuario"}</div>
          </div>

          <div className="flex flex-col py-1">
            <button
              onClick={() => {
                setOpen(false);
                router.push("/profile"); // opcional: link a profile
              }}
              className="text-left px-4 py-2 hover:bg-gray-100"
            >
              Ver perfil
            </button>

            <button
              onClick={handleLogout}
              className="text-left px-4 py-2 hover:bg-gray-100 text-red-600"
            >
              Cerrar sesión
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
