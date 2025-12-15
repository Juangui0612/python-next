"use client"
import { useState } from "react"
import { POSTCategory } from "@/actions/category-action"
import {getCookie} from "cookies-next"

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  onProductCreated?: () => void
}

export default function ModalCategory({ isOpen, onClose, onProductCreated }: ModalProps) {

  const [formData, setFormData] = useState({
    name: "",
    description: ""
  })

  // Manejar cambios en los inputs
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  // Enviar formulario
  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const token = (getCookie("ap_token") as string) || "";
      await POSTCategory({
        name: formData.name,
        description: formData.description,
        token
      })
      console.log("✅ Producto creado con éxito")
      if (onProductCreated) onProductCreated()
      onClose() // cerrar modal
    } catch (error) {
      console.log("Error al crear producto", error)
      alert("❌ No se pudo crear el producto")
    }
  }



  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-gray-900/30 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white text-black p-6 rounded-lg w-80 modal" style={{ zIndex: 100 }}>
            <h2 className="text-lg font-bold mb-4">Crear Categoria</h2>

            <form onSubmit={onSubmit} className="space-y-3">
              <input
                name="name"
                placeholder="Nombre"
                value={formData.name}
                onChange={handleChange}
                className="text-black w-full border px-2 py-1 rounded"
                required
              />

              <textarea
                name="description"
                placeholder="Descripción"
                value={formData.description}
                onChange={handleChange}
                className="text-black w-full border px-2 py-1 rounded"
              />



              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="text-black px-3 py-1 border rounded"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className=" text-black px-3 py-1 bg-blue-600 text-white rounded"
                >
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </>

  )
}

