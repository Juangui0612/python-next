// src/actions/user-action.server.ts  (server action)
"use server";

const BASE_URL = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

interface FormData {
  username?: string;
  password?: string;
}

export const Login = async (formdata: FormData) => {
  try {
    const response = await fetch(`${BASE_URL}/api/token/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formdata),
      // importante: en servidor no setea credentials por defecto
    });

    if (!response.ok) {
      const err = await response.json();
      return { error: err };
    }

    const login = await response.json(); // { access, refresh }
    // Retorna los tokens al cliente (el cliente debe almacenarlos).
    return login;
  } catch (error) {
    console.error("Error login", error);
    return { error: "server_error" };
  }
};
