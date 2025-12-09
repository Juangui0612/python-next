"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Login } from "@/actions/login-action"

export default function LoginPage() {
  const router = useRouter()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    try {
      const data = await Login({ username, password })
      const token = data.access || data.token

      if (!token) throw new Error("No se recibió el token")

      // Guarda el token en cookie simple (temporal)
      document.cookie = `ap_token=${token}; path=/; max-age=${60 * 60 * 24}`

      router.push("/dashboard/products")
    } catch (err) {
      console.log("error en iniciar sesion", err)
    }
  }

  return (
    <div className="flex h-screen items-center justify-center bg-gray-100">
      <form
        onSubmit={handleLogin}
        className="bg-white p-8 rounded-lg shadow-lg w-96 space-y-4"
      >
        <h2 className="text-2xl font-semibold text-center text-gray-800">
          Iniciar Sesión
        </h2>

        {error && (
          <p className="text-red-500 text-sm text-center">{error}</p>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Usuario
          </label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="w-full border rounded-lg px-3 py-2 mt-1 focus:ring focus:ring-blue-200 outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Contraseña
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full border rounded-lg px-3 py-2 mt-1 focus:ring focus:ring-blue-200 outline-none"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Entrar
        </button>
        <p className="text-sm text-center">
          ¿No tienes cuenta?{" "}
          <a href="/register" className="text-blue-600 hover:underline">Regístrate</a>
        </p>
      </form>
    </div>
  )
}
