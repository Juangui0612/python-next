"use server";

const BASE_URL = process.env.API_URL

interface FormData {
    id?: number;
    name?: string;
    description?: string;
    price?: number;
    amount?: number;
    category?: number
    token?: string;
}

export const GETProduct = async () => {
    try {
        const response = await fetch(`${BASE_URL}/api/products/`, {
            method: "GET",
        });

        const products = await response.json()
        //console.log("no muestra nada",products)
        return products
    } catch (error) {
        console.log("Error hacer la peticion", error)
    }
}

export const POSTProducts = async (formdata: FormData) => {
    try {
        const response = await fetch(`${BASE_URL}/api/products/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${formdata.token}`
            },
            body: JSON.stringify(formdata),
        });
        const product = await response.json()
        console.log("no se creo",product)
        return product
    } catch (error) {
        console.log(error);
    }
};

export const DELETEProduct = async (id: number, token: string) => {
    try {
        const res = await fetch(`${process.env.API_URL}/api/products/${id}/`, {
            method: "DELETE",
            headers: {
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


export const PUTProduct = async (id: number, token: string, updateData: FormData) => {
    try {
        const response = await fetch(`${BASE_URL}/api/products/${id}/`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(updateData)
        });
        const product = await response.json();
        return product;
    } catch (error) {
        console.error("No se actualizo el producto", error)
    }
}