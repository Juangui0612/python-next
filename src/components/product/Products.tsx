"use client"
import { useState, useEffect } from "react"
import { GETProduct, DELETEProduct, PUTProduct } from "@/actions/product-actions"
import { GETCategory } from "@/actions/category-action"
import { getCookie } from "cookies-next"
import ModalProduct from "./ModalProduct"
import ModalEdit from "./ModalEdit"
import { Edit, Trash2 } from "lucide-react";
import UserBubble from "@/components/UserBubble";



interface Products {
    id: number,
    name: string,
    description: string,
    price: number,
    amount: number,
    category: number
}

interface Category {
    id_category: number
    name: string
}

export default function Products() {

    const [product, setProduct] = useState<Products[]>([])
    const [category, setCategory] = useState<Category[]>([])
    const [createProduct, setCreateProduct] = useState(false) //modal de crear 
    const [editproduct, setEditProduct] = useState(false) //modal de editar
    const [selectproduct, setSelectProduct] = useState<Products | null>(null) //modal de editar

    const GETProductAPI = async () => {
        try {
            const response = await GETProduct();
            console.log("no quiere dar", response)
            if (!response.results) {
                setProduct([])
                return
            }
            // Asume que la API devuelve un array
            setProduct(Array.isArray(response.results) ? response.results : []);
        } catch (error) {
            console.log("Error en los products", error)
        }
    }

    const GETCategoryapi = async () => {
        try {
            const response = await GETCategory();
            setCategory(Array.isArray(response) ? response : []);
        } catch (error) {
            console.log("no se pudo encontrar los datos de categoria", error)
        }
    }

    useEffect(() => {
        GETProductAPI()
        GETCategoryapi()
    }, [])

    const handledelete = async (id: number) => {
        const token = getCookie("ap_token") as string || "";
        const res = await DELETEProduct(id, token);
        if (res.ok) {
            setProduct(prev => prev.filter(p => p.id !== id));
        } else {
            console.error("No se pudo eliminar el producto");
        }
    };


    const handleUpdate = async (id: number, updateData: FormData) => {
        try {
            const token = getCookie("ap_token") as string || "";
            const jsonData = Object.fromEntries(updateData.entries());

            // Optimistic UI: actualizar localmente
            setProduct(prevProduct => prevProduct.map(p => p.id === id ? { ...p, ...jsonData } : p))

            const res = await PUTProduct(id, token, jsonData)

            if (res?.message != "Product actualizado") {
                console.log("No se pudo actualizar el producto")
                // Si falla, opcionalmente volver a recargar la lista:
                await GETProductAPI()
            }

            // Cerrar modal
            setEditProduct(false)
            setSelectProduct(null)

        } catch (error) {
            console.error("Error al actualizar el producto", error)
        }
    }

    // abrir modal de edición y asignar producto seleccionado
    const openEditModal = (p: Products) => {
        setSelectProduct(p)
        setEditProduct(true)
    }

    return (
        <section className="space-y-6 w-full">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-800">Lista de Productos</h2>
                <div className="flex items-center gap-4">
                    {/* La burbuja se mostrará justo a la izquierda/encima del botón */}
                    <UserBubble />

                    <button onClick={() => setCreateProduct(true)} className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-700">
                        + Crear Producto
                    </button>
                </div>
            </div>

            {/* Modal de creación */}
            <ModalProduct
                isOpen={createProduct}
                onClose={() => setCreateProduct(false)}
                onProductCreated={GETProductAPI}
            />

            <div className="relative overflow-hidden rounded-lg border border-gray-200 shadow-sm">
                <table className="w-full text-sm text-left text-gray-700">
                    <thead className="bg-gray-100 text-gray-900 uppercase text-xs font-semibold">
                        <tr>
                            <th scope="col" className="px-6 py-3">Nombre</th>
                            <th scope="col" className="px-6 py-3">Descripción</th>
                            <th scope="col" className="px-6 py-3 text-right">Precio</th>
                            <th scope="col" className="px-6 py-3 text-center">Cantidad</th>
                            <th scope="col" className="px-6 py-3 text-center">Categoria</th>
                            <th scope="col" className="px-6 py-3 text-center">Acciones</th>
                        </tr>
                    </thead>

                    <tbody>
                        {product && product.length > 0 ? (
                            product.map((p) => (
                                <tr
                                    key={p.id}
                                    className="border-t hover:bg-gray-50 transition"
                                >
                                    <td className="text-black px-6 py-3 font-medium text-gray-900">{p.name}</td>
                                    <td className="text-black px-6 py-3 text-gray-600 truncate max-w-xs">{p.description}</td>
                                    <td className="text-black px-6 py-3 text-right font-semibold text-green-600">
                                        ${Number(p.price).toLocaleString('es-CO', { minimumFractionDigits: 0 })}
                                    </td>
                                    <td className="text-black px-6 py-3 text-center">{p.amount}</td>
                                    <td className=" text-black px-6 py-3 text-center">
                                        {category.find((c) => Number(c.id_category) === Number(p.category))?.name}
                                    </td>

                                    <td className="px-6 py-3 text-center flex justify-center gap-2">
                                        <button
                                            onClick={() => openEditModal(p)}
                                            className="flex items-center gap-1 bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700 transition font-medium shadow-sm"
                                        >
                                            <Edit size={16} />
                                            Editar
                                        </button>
                                        <button
                                            onClick={() => handledelete(p.id)}
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

                {editproduct && selectproduct && (
                    <ModalEdit
                        isOpen={editproduct}
                        onClose={() => { setEditProduct(false); setSelectProduct(null) }}
                        product={selectproduct}
                        onUpdate={handleUpdate}
                    />
                )}

            </div>

        </section>

    )
}


