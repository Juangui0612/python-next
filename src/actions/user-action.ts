"use server";
const BASE_URL = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

interface RegisterForm {
  username: string;
  email?: string;
  password: string;
}

export async function Register(form: RegisterForm) {
  try {
    // Ajusta la ruta si tu backend usa /auth/register/ u otra
    const res = await fetch(`${BASE_URL}/api/register/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
      // si el backend está en otro dominio y necesita credenciales: credentials: 'include'
    });


    const data = await res.json();
    // data puede contener { access, refresh } o { token } — adáptalo según tu backend
    return data;
  } catch (error) {
    console.error("Error en Register action:", error);
    throw error;
  }
}
