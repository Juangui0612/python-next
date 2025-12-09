"use client"
import { useState, useEffect } from "react"
import { GETCategory, DELETECategory, PUTCategory } from "@/actions/category-action"
import ModalCategory from "./ModalCategory"
import ModalEdit from "./ModalEdit"
import {getCookie} from "cookies-next"
import { Edit, Trash2 } from "lucide-react";


interface Category {
  id_category: number,
  name: string,
  description: string,
}

export default function Category() {
  const [category, setCategory] = useState<Category[]>([])
  const [createCategory, setCreateCategory] = useState(false)
  const [editcategory, setEditCategory] = useState(false) //modal de editar
  const [selectcategory, setSelectCategory] = useState<Category | null>(null) //modal de editar


  const GETCategoryAPI = async () => {
    try {
      const response = await GETCategory();
      if (!response) {
        setCategory([])
        return
      }
      // Asume que la API devuelve un array
      setCategory(Array.isArray(response) ? response : []);
    } catch (error) {
      console.log("Error en los products", error)
    }
  }

  useEffect(() => {
    GETCategoryAPI()
  }, [])

  const handledelete = async (id_category: number) => {
    const token = getCookie("ap_token") as string || "";
    const res = await DELETECategory(id_category, token);
    if (res.ok) {
      setCategory(prev => prev.filter(p => p.id_category !== id_category));
    } else {
      console.error("No se pudo eliminar el producto");
    }
  };


  const handleUpdate = async (id_category: number, updateData: FormData) => {
    try {
      const token = getCookie("ap_token") as string || "";
      const jsonData = Object.fromEntries(updateData.entries());

      // Optimistic UI: actualizar localmente
      setCategory(prevProduct => prevProduct.map(p => p.id_category === id_category ? { ...p, ...jsonData } : p))

      const res = await PUTCategory(id_category, token, jsonData)

      if (res?.message != "Product actualizado") {
        console.log("No se pudo actualizar el producto")
        // Si falla, opcionalmente volver a recargar la lista:
        await GETCategoryAPI()
      }

      // Cerrar modal
      setEditCategory(false)
      setSelectCategory(null)

    } catch (error) {
      console.error("Error al actualizar el producto", error)
    }
  }

  // abrir modal de edición y asignar producto seleccionado
  const openEditModal = (p: Category) => {
    setSelectCategory(p)
    setEditCategory(true)
  }

  return (
    <section className="space-y-6 w-full">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-800">Lista de Categorias</h2>
        <button
          onClick={() => setCreateCategory(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-md transition"
        >
          + Crear Categoria
        </button>

      </div>

      {/* Modal de creación */}
      <ModalCategory
        isOpen={createCategory}
        onClose={() => setCreateCategory(false)}
        onProductCreated={GETCategoryAPI}
      />



      <div className="relative overflow-hidden rounded-lg border border-gray-200 shadow-sm">
        <table className="w-full text-sm text-left text-gray-700">
          <thead className="bg-gray-100 text-gray-900 uppercase text-xs font-semibold">
            <tr>
              <th scope="col" className="px-6 py-3">Nombre</th>
              <th scope="col" className="px-6 py-3">Descripción</th>
              <th scope="col" className="px-6 py-3 text-center">Acciones</th>
            </tr>
          </thead>

          <tbody>
            {category && category.length > 0 ? (
              category.map((c) => (
                <tr
                  key={c.id_category}
                  className="border-t hover:bg-gray-50 transition"
                >
                  <td className="px-6 py-3 font-medium text-gray-900">{c.name}</td>
                  <td className="px-6 py-3 text-gray-600 truncate max-w-xs">{c.description}</td>



                  <td className="px-6 py-3 text-center flex justify-center gap-2">
  <button
    onClick={() => openEditModal(c)}
    className="flex items-center gap-1 bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700 transition font-medium shadow-sm"
  >
    <Edit size={16} />
    Editar
  </button>
  <button
    onClick={() => handledelete(c.id_category)}
    className="flex items-center gap-1 bg-red-600 text-white px-3 py-1.5 rounded-lg hover:bg-red-700 transition font-medium shadow-sm"
  >
    <Trash2 size={16} />
    Eliminar
  </button>
</td>


                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={5}
                  className="text-center text-gray-500 py-6 italic"
                >
                  No hay productos disponibles
                </td>
              </tr>
            )}
          </tbody>
        </table>
        {editcategory && selectcategory && (
          <ModalEdit
            isOpen={editcategory}
            onClose={() => { setEditCategory(false); setSelectCategory(null) }}
            category={selectcategory}
            onUpdate={handleUpdate}
          />
        )}


      </div>

    </section>

  )
}
