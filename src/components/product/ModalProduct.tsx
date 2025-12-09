"use client"
import { useState, useEffect } from "react"
import { POSTProducts } from "@/actions/product-actions"
import { GETCategory } from "@/actions/category-action"
import { getCookie } from "cookies-next"

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProductCreated?: () => void;
}

interface Category {
  id_category: number;
  name: string;
}

export default function ModalProduct({ isOpen, onClose, onProductCreated }: ModalProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    amount: "",
    id_category: "" // 👈 aquí guardamos la categoría
  });

  // ✅ Cargar categorías al abrir el modal
  useEffect(() => {
    if (!isOpen) return;

    const fetchCategories = async () => {
      const result = await GETCategory();
      setCategories(result);
    };

    fetchCategories();
  }, [isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = (getCookie("ap_token") as string) || "";

      await POSTProducts({
        name: formData.name,
        description: formData.description,
        price: Number(formData.price),
        amount: Number(formData.amount),
        category: Number(formData.id_category),
        token
      });

      if (onProductCreated) onProductCreated();
      onClose();
    } catch (error) {
      console.log("Error al crear producto", error);
      alert("❌ No se pudo crear el producto");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-900/30 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-80 modal">
        <h2 className="text-lg font-bold mb-4">Crear producto</h2>

        <form onSubmit={onSubmit} className="space-y-3">

          <input name="name" placeholder="Nombre"
            value={formData.name} onChange={handleChange}
            className="w-full border px-2 py-1 rounded" required />

          <textarea name="description" placeholder="Descripción"
            value={formData.description} onChange={handleChange}
            className="w-full border px-2 py-1 rounded" />

          <input name="price" type="number" placeholder="Precio"
            value={formData.price} onChange={handleChange}
            className="w-full border px-2 py-1 rounded" required />

          <input name="amount" type="number" placeholder="Cantidad"
            value={formData.amount} onChange={handleChange}
            className="w-full border px-2 py-1 rounded" required />

          {/* ✅ SELECT de categorías */}
          <select
            name="id_category"
            value={formData.id_category}
            onChange={handleChange}
            className="w-full border px-2 py-1 rounded"
            required
          >
            <option value="">Selecciona una categoría</option>
            {categories.map(cat => (
              <option key={cat.id_category} value={cat.id_category}>
                {cat.name}
              </option>
            ))}
          </select>

          <div className="flex justify-end space-x-2 pt-2">
            <button type="button" onClick={onClose} className="px-3 py-1 border rounded">
              Cancelar
            </button>
            <button type="submit" className="px-3 py-1 bg-blue-600 text-white rounded">
              Guardar
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
