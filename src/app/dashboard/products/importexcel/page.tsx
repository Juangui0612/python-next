"use client"

import ModalUploadExcel from "@/components/product/ModalUploadExcel"
import { useRouter } from "next/navigation"

export default function ImportExcelPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <ModalUploadExcel
        onClose={() => router.push("/dashboard/products")}
        onSuccess={() => router.push("/dashboard/products")}
      />
    </div>
  )
}
