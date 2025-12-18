"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, Package, Layers, LayoutDashboard } from "lucide-react";

export default function Sidebar() {
  const [open, setOpen] = useState(true);

  const toggleSidebar = () => setOpen(!open);

  return (
    <>
      {/* Botón toggle visible solo en pantallas pequeñas */}
      <button
        onClick={toggleSidebar}
        className="md:hidden p-3 fixed top-4 left-4 z-50 bg-gray-800 text-white rounded-lg"
      >
        {open ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Sidebar */}
      <aside
        className={`${
          open ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 fixed md:static z-40 w-64 bg-gray-900 text-white h-screen p-5 transition-transform duration-300`}
      >
        <h1 className="text-2xl font-bold mb-8">CrudPython</h1>

        <nav className="flex flex-col space-y-4">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 hover:text-blue-400"
          >
            <LayoutDashboard size={18} /> Dashboard
          </Link>
          <Link
            href="/dashboard/category"
            className="flex items-center gap-2 hover:text-blue-400"
          >
            <Layers size={18} /> Categoría
          </Link>
          <Link
            href="/dashboard/products"
            className="flex items-center gap-2 hover:text-blue-400"
          >
            <Package size={18} /> Productos
          </Link>

          
        </nav>
      </aside>
    </>
  );
}
