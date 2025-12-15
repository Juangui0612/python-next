"use client"
import { useState, useEffect } from "react"

interface Category {
  id_category: number
  name: string
  description: string
}



interface ModalEditProps {
  isOpen: boolean
  onClose: () => void
  category: Category
  onUpdate: (id_category: number, updateData: FormData) => Promise<void>
}

export default function ModalEdit({ isOpen, onClose, category, onUpdate }: ModalEditProps) {
  const [name, setName] = useState(category.name)
  const [description, setDescription] = useState(category.description)
  // corregido: usar product.category
 
  const [submitting, setSubmitting] = useState(false)

  // cada vez que cambia `product` (al abrir modal con otro product) sincronizamos estados
  useEffect(() => {
    setName(category.name)
    setDescription(category.description) // defensivo por si viene null/undefined
  }, [category])

  // cargar categorías cuando el modal se abre
  

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      const formData = new FormData()
      formData.append("name", name)
      formData.append("description", description) 
      await onUpdate(category.id_category, formData)
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
          <h3 className="text-lg font-semibold">Editar Categoria</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">X</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-black block text-sm font-medium text-gray-700">Nombre</label>
            <input
              value={name}
              onChange={e => setName(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2"
              required
            />
          </div>

          <div>
            <label className="text-black block text-sm font-medium text-gray-700">Descripción</label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              className="text-black mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2"
              rows={3}
            />
          </div>


          <div className="flex justify-end gap-2">
            <button type="button" onClick={onClose} className="text-black px-4 py-2 rounded-md border">
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
