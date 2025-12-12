"use server";

// ⭐ CAMBIO AQUÍ: Usa API_URL (sin NEXT_PUBLIC_) para server actions
const BASE_URL = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

interface FormData {
    id_category?: number,
    name?: string
    description?: string
    token?: string
}

export const GETCategory = async() => {
    try {
        const response = await fetch(`${BASE_URL}/api/categories/`,{
            method:"GET",
        });

        const category = await response.json()
        return category
    } catch (error) {
        console.log("Error hacer la peticion", error)
    }
}

export const POSTCategory = async(formdata: FormData)=>{
    try {
        const response = await fetch(`${BASE_URL}/api/categories/`,{
            method: "POST",
             headers:{
                "Content-Type": "application/json",
                "Authorization": `Bearer ${formdata.token}`
            },
            body: JSON.stringify(formdata),
        });
        const category = await response.json()
        return category
    } catch (error) {
        console.log("Error a la hora de crear la categoria",error);
    }
};

export const DELETECategory = async (id_category: number, token:string) => {
  try {
    // ⭐ CAMBIO AQUÍ: Usar BASE_URL en vez de process.env.API_URL
    const res = await fetch(`${BASE_URL}/api/categories/${id_category}/`, {
      method: "DELETE",
       headers:{
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
    });
    return { ok: res.ok, status: res.status };
  } catch (error) {
    console.error("Error al eliminar producto:", error);
    return { ok: false };
  }
};

export const PUTCategory = async(id_category:number, token: string, updateData: FormData)=>{
    try {
        const response = await fetch(`${BASE_URL}/api/categories/${id_category}/`,{
            method: "PUT",
            headers:{
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(updateData)
        });
        const category = await response.json();
        console.log("metodo put no esta funcinando",category)
        return category;
    } catch (error) {
        console.error("No se actualizo el producto",error)        
    }
}