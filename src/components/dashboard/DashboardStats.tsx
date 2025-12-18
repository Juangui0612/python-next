"use client";

import { useEffect, useState } from "react";
import { GETProduct } from "@/actions/product-actions";
import { GETCategory } from "@/actions/category-action";
import ProductsByCategoryChart from "./ProductsByCategoryChart";
import StatCard from "./StatCard";

interface Product {
  id_product: number;
  name: string;
  description: string;
  price: number;
  amount: number;
  category: number;
}

interface Category {
  id_category: number;
  name: string;
}

export default function DashboardStats() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const productData = await GETProduct();
      setProducts(
        Array.isArray(productData?.results)
          ? productData.results
          : Array.isArray(productData)
          ? productData
          : []
      );

      const categoryData = await GETCategory();
      setCategories(
        Array.isArray(categoryData) ? categoryData : []
      );

      setLoading(false);
    }

    load();
  }, []);

  if (loading) {
    return <p className="text-gray-500">Cargando dashboard...</p>;
  }

  const productsByCategory = categories.map(cat => ({
  name: cat.name,
  total: products.filter(p => p.category === cat.id_category).length,
}));

 return (
  <>
    {/* Cards */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatCard title="Total productos" value={products.length} />
      <StatCard title="Total categorías" value={categories.length} />
    </div>

    {/* Charts */}
    <div className="mt-8">
      <ProductsByCategoryChart data={productsByCategory} />
    </div>
  </>
);

}
