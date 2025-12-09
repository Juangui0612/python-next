"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Register } from "@/actions/user-action";

export default function RegisterPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!username || !password) {
      setError("Completa los campos obligatorios.");
      return;
    }

    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres.");
      return;
    }


    setLoading(true);
    try {
      const data = await Register({ username, email, password });

      // Ajusta según lo que devuelva tu backend:
      // puede venir data.access / data.refresh o data.token
      const token = data.access || data.token || data.jwt;

      if (!token) {
        // Si el backend no devuelve token inmediatamente, redirige al login
        router.push("/login");
        return;
      }

      // Guardamos token (temporal, no httpOnly). Más adelante puedes cambiar a API route que
      // establezca cookie httpOnly.
      document.cookie = `ap_token=${token}; path=/; max-age=${60 * 60 * 24}`;

      router.push("/dashboard/products");
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handleRegister} className="bg-white shadow-lg p-8 rounded-xl w-96 space-y-4">
        <h1 className="text-2xl font-bold text-center">Crear cuenta</h1>

        {error && <p className="text-sm text-red-600 text-center">{error}</p>}

        <div>
          <label className="block text-sm font-medium text-gray-700">Usuario</label>
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="mt-1 block w-full border rounded px-3 py-2"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Correo (opcional)</label>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            className="mt-1 block w-full border rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Contraseña</label>
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            className="mt-1 block w-full border rounded px-3 py-2"
            required
          />
        </div>

        

        <div className="flex justify-between items-center">
          <button
            type="button"
            onClick={() => router.push("/login")}
            className="px-4 py-2 border rounded"
          >
            Volver
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            {loading ? "Creando..." : "Crear cuenta"}
          </button>
        </div>
      </form>
    </div>
  );
}
