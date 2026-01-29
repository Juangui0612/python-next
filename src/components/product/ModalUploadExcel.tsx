"use client"

import { useEffect, useRef, useState } from "react"
import * as XLSX from "xlsx"
import { POSTProducts } from "@/actions/product-actions"
import { GETCategory } from "@/actions/category-action"
import { getCookie } from "cookies-next"
import ModalStatus from "@/components/ui/ModalStatus"

interface Props {
  onClose: () => void
  onSuccess?: () => void
}

interface ExcelProduct {
  name: string
  description?: string
  price: number
  amount: number
}

interface Category {
  id_category: number
  name: string
}

export default function ModalUploadExcel({ onClose, onSuccess }: Props) {
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const [categoryId, setCategoryId] = useState<number | "">("")
  const inputRef = useRef<HTMLInputElement>(null)

  // modal estado
  const [statusOpen, setStatusOpen] = useState(false)
  const [statusTitle, setStatusTitle] = useState("")
  const [statusMessage, setStatusMessage] = useState("")
  const [statusType, setStatusType] =
    useState<"success" | "error" | "info">("info")

  useEffect(() => {
    GETCategory().then(setCategories)
  }, [])

  const showStatus = (
    title: string,
    message: string,
    type: "success" | "error" | "info"
  ) => {
    setStatusTitle(title)
    setStatusMessage(message)
    setStatusType(type)
    setStatusOpen(true)
  }

  const handleUpload = async () => {
    if (!file) {
      showStatus("Archivo requerido", "Selecciona un archivo Excel", "info")
      return
    }

    if (!categoryId) {
      showStatus("Categoría requerida", "Selecciona una categoría", "info")
      return
    }

    try {
      setLoading(true)
      const token = (getCookie("ap_token") as string) || ""

      const buffer = await file.arrayBuffer()
      const workbook = XLSX.read(buffer)
      const sheet = workbook.Sheets[workbook.SheetNames[0]]
      const rawRows = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet)

      const products: ExcelProduct[] = rawRows
        .map(row => {
          const clean: Record<string, unknown> = {}
          Object.keys(row).forEach(k => {
            clean[k.trim().toLowerCase()] = row[k]
          })

          return {
            name: String(clean.name ?? ""),
            description: String(clean.description ?? ""),
            price: Number(clean.price),
            amount: Number(clean.amount)
          }
        })
        .filter(p => p.name && !isNaN(p.price) && !isNaN(p.amount))

      if (!products.length) {
        showStatus("Excel inválido", "No hay filas válidas", "error")
        return
      }

      for (const product of products) {
        await POSTProducts({
          ...product,
          category: categoryId,
          token
        })
      }

      showStatus(
        "Carga exitosa",
        `${products.length} productos fueron cargados correctamente`,
        "success"
      )

    } catch (error) {
      console.error(error)
      showStatus(
        "Error",
        "Ocurrió un error al importar los productos",
        "error"
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-40">
        <div className="bg-white rounded-xl p-6 w-96 space-y-4 shadow-lg">

          <h2 className="text-lg font-semibold text-center text-gray-900">
            Importar productos desde Excel
          </h2>

          <select
            value={categoryId}
            onChange={e => setCategoryId(Number(e.target.value))}
            className="w-full border rounded px-3 py-2 text-gray-900"
          >
            <option value="">Selecciona una categoría</option>
            {categories.map(cat => (
              <option key={cat.id_category} value={cat.id_category}>
                {cat.name}
              </option>
            ))}
          </select>

          <input
            ref={inputRef}
            type="file"
            accept=".xlsx,.xls"
            onChange={e => setFile(e.target.files?.[0] || null)}
            className="hidden"
          />

          <button
            onClick={() => inputRef.current?.click()}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg"
          >
            📂 Seleccionar Excel
          </button>

          {file && (
            <p className="text-sm text-gray-600 text-center truncate">
              {file.name}
            </p>
          )}

          <div className="flex justify-end gap-2 pt-2">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 rounded text-gray-900"
            >
              Cancelar
            </button>

            <button
              onClick={handleUpload}
              disabled={loading}
              className="px-4 py-2 bg-green-600 text-white rounded"
            >
              {loading ? "Cargando..." : "Importar"}
            </button>
          </div>
        </div>
      </div>

      {/* MODAL DE ESTADO */}
      <ModalStatus
        open={statusOpen}
        title={statusTitle}
        message={statusMessage}
        type={statusType}
        onClose={() => {
          setStatusOpen(false)
          if (statusType === "success") {
            onSuccess?.()
            onClose()
          }
        }}
      />
    </>
  )
}
