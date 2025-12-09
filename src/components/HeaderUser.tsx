"use client";
import { useEffect, useState } from "react";
import { getCookie } from "cookies-next";
import { jwtDecode } from "jwt-decode";

type TokenPayload = {
  username?: string;
  email?: string;
};

export default function HeaderUser() {
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    const token = getCookie("ap_token") as string | undefined;
    if (!token) return;

    try {
      const payload = jwtDecode<TokenPayload>(token);
      console.log("Payload decodificado:", payload); // 👈 para verificar en consola
      setUsername(payload.username ?? null);
    } catch (err) {
      console.error("Token inválido", err);
    }
  }, []);

  if (!username) return <div>Bienvenido</div>;
  return (
    <div>
      Hola, <strong>{username}</strong>
    </div>
  );
}
