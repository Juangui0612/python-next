"use client"
import { useState, useEffect } from "react"
import { GETCategory } from "@/actions/category-action"

interface Products {
  id: number
  name: string
  description: string
  price: number
  amount: number
  category: number
}

interface Category {
  id_category: number
  name: string
  // ajusta si tu API devuelve otro campo (por ejemplo `id` en vez de `id_category`)
}

interface ModalEditProps {
  isOpen: boolean
  onClose: () => void
  product: Products
  onUpdate: (id: number, updateData: FormData) => Promise<void>
}

export default function ModalEdit({ isOpen, onClose, product, onUpdate }: ModalEditProps) {
  const [name, setName] = useState(product.name)
  const [description, setDescription] = useState(product.description)
  const [price, setPrice] = useState(String(product.price))
  const [amount, setAmount] = useState(String(product.amount))
  const [category, setCategory] = useState(String(product.category)) // corregido: usar product.category
  const [categories, setCategories] = useState<Category[]>([])
  const [loadingCategories, setLoadingCategories] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  // cada vez que cambia `product` (al abrir modal con otro product) sincronizamos estados
  useEffect(() => {
    setName(product.name)
    setDescription(product.description)
    setPrice(String(product.price))
    setAmount(String(product.amount))
    setCategory(String(product.category ?? "")) // defensivo por si viene null/undefined
  }, [product])

  // cargar categorías cuando el modal se abre
  useEffect(() => {
    if (!isOpen) return

    let mounted = true
    const load = async () => {
      setLoadingCategories(true)
      try {
        const res = await GETCategory()
        // si tu GETCategory ya devuelve la lista directamente, usa eso.
        // aquí tratamos de ser defensivos: si viene .data o similar, ajusta.
        const list = Array.isArray(res) ? res : res?.data ?? []
        if (mounted) setCategories(list)
      } catch (err) {
        console.error("Error cargando categorías:", err)
        if (mounted) setCategories([])
      } finally {
        if (mounted) setLoadingCategories(false)
      }
    }
    load()
    return () => {
      mounted = false
    }
  }, [isOpen])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      const formData = new FormData()
      formData.append("name", name)
      formData.append("description", description)
      formData.append("price", price)
      formData.append("amount", amount)
      formData.append("category", category) // importante: enviar la category
      await onUpdate(product.id, formData)
      onClose()
    } catch (err) {
      console.error("Error actualizando producto:", err)
      // si quieres, aquí puedes mostrar un toast/alert al usuario
    } finally {
      setSubmitting(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Editar producto</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">Cerrar</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Nombre</label>
            <input
              value={name}
              onChange={e => setName(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Descripción</label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700">Precio</label>
              <input
                value={price}
                onChange={e => setPrice(e.target.value)}
                type="number"
                step="any"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Cantidad</label>
              <input
                value={amount}
                onChange={e => setAmount(e.target.value)}
                type="number"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2"
                required
              />
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700">Categoría</label>

              {loadingCategories ? (
                <div className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2">Cargando categorías...</div>
              ) : (
                <select
                  name="category"
                  value={category}
                  onChange={e => setCategory(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2"
                  required
                >
                  <option value="" disabled>Selecciona una categoría</option>
                  {categories.map((c) => (
                    // ajusta el campo id según lo que devuelva tu API
                    <option key={c.id_category} value={String(c.id_category)}>
                      {c.name}
                    </option>
                  ))}
                </select>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-md border">
              Cancelar
            </button>
            <button type="submit" disabled={submitting} className="px-4 py-2 rounded-md bg-blue-600 text-white">
              {submitting ? "Guardando..." : "Guardar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
