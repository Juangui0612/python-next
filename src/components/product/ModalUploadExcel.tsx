"use client"

import { useRef, useState } from "react"
import * as XLSX from "xlsx"
import { POSTProducts } from "@/actions/product-actions"
import { getCookie } from "cookies-next"

interface Props {
  onClose: () => void
  onSuccess?: () => void
}

interface ExcelProduct {
  name: string
  description?: string
  price: number
  amount: number
  category: number
}

export default function ModalUploadExcel({ onClose, onSuccess }: Props) {
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      setFile(e.target.files[0])
    }
  }

  const handleUpload = async () => {
    if (!file) {
      alert("❌ Selecciona un archivo Excel")
      return
    }

    try {
      setLoading(true)
      const token = (getCookie("ap_token") as string) || ""

      const data = await file.arrayBuffer()
      const workbook = XLSX.read(data)
      const sheet = workbook.Sheets[workbook.SheetNames[0]]

      const rawRows = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet)

      if (!rawRows.length) {
        alert("❌ El archivo está vacío")
        return
      }

      // Normalizar columnas
      const rows: ExcelProduct[] = rawRows
        .map(row => {
          const clean: Record<string, unknown> = {}

          Object.keys(row).forEach(key => {
            clean[key.trim().toLowerCase()] = row[key]
          })

          return {
            name: String(clean.name ?? ""),
            description: String(clean.description ?? ""),
            price: Number(clean.price),
            amount: Number(clean.amount),
            category: Number(clean.category)
          }
        })
        .filter(
          p =>
            p.name &&
            !isNaN(p.price) &&
            !isNaN(p.amount) &&
            !isNaN(p.category)
        )

      if (!rows.length) {
        alert("❌ No hay filas válidas en el Excel")
        return
      }

      for (const product of rows) {
        await POSTProducts({
          ...product,
          token
        })
      }

      alert("✅ Productos importados correctamente")
      onSuccess?.()
      onClose()

    } catch (error) {
      console.error("Error al importar Excel", error)
      alert("❌ Error al importar productos")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-96 space-y-4 text-black shadow-lg">

        <h2 className="text-lg font-semibold text-center">
          Importar productos desde Excel
        </h2>

        {/* INPUT FILE OCULTO */}
        <input
          ref={inputRef}
          type="file"
          accept=".xlsx,.xls"
          onChange={handleFile}
          className="hidden"
        />

        {/* BOTÓN SELECCIONAR ARCHIVO */}
        <button
          onClick={() => inputRef.current?.click()}
          className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
        >
          📂 Seleccionar archivo Excel
        </button>

        {/* NOMBRE DEL ARCHIVO */}
        {file && (
          <p className="text-sm text-gray-600 truncate text-center">
            Archivo seleccionado:
            <br />
            <b>{file.name}</b>
          </p>
        )}

        <p className="text-sm text-gray-600 text-center">
          Columnas requeridas:
          <br />
          <b>name, description, price, amount, category</b>
        </p>

        <div className="flex justify-end gap-2 pt-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded bg-gray-300"
            disabled={loading}
          >
            Cancelar
          </button>

          <button
            onClick={handleUpload}
            className="px-4 py-2 rounded bg-green-600 text-white disabled:opacity-50"
            disabled={loading}
          >
            {loading ? "Cargando..." : "Cargar Excel"}
          </button>
        </div>

      </div>
    </div>
  )
}
