"use client"

interface Props {
  open: boolean
  title: string
  message: string
  type?: "success" | "error" | "info"
  onClose: () => void
}

export default function ModalStatus({
  open,
  title,
  message,
  type = "info",
  onClose
}: Props) {
  if (!open) return null

  const colors = {
    success: "bg-green-600",
    error: "bg-red-600",
    info: "bg-blue-600"
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-96 space-y-4 shadow-lg text-black">

        <h2 className="text-lg font-semibold text-center">
          {title}
        </h2>

        <p className="text-center text-gray-700">
          {message}
        </p>

        <div className="flex justify-center pt-4">
          <button
            onClick={onClose}
            className={`px-4 py-2 text-white rounded ${colors[type]}`}
          >
            Aceptar
          </button>
        </div>

      </div>
    </div>
  )
}
