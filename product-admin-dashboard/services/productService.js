import { api } from "./axiosInstance";

export const getCategories = async () => {
    const response = await api.get("/products/categories");
    return response.data;
};

export const getProducts = async (limit = 10, skip = 0, search = "", category = "", sortBy = "", order = "asc", signal) => {
    let url = "";

    // Enforce mutual exclusivity to handle the API limitation
    if (search) {
        url = `/products/search?q=${search}&limit=${limit}&skip=${skip}&delay=2000`;
    } else if (category && category !== "all") {
        // If category is selected and there's no search, use the category endpoint
        url = `/products/category/${category}?limit=${limit}&skip=${skip}`;
    } else {
        url = `/products?limit=${limit}&skip=${skip}`;
    }

    // Append sorting parameters if selected
    if (sortBy) {
        url += `&sortBy=${sortBy}&order=${order}`;
    }

    const response = await api.get(url, { signal });
    return response.data;
};
export const getProductById = async (id) => {
    const response = await api.get(`/products/${id}`);
    return response.data;
};

export const addProduct = async (productData) => {
    const response = await api.post("/products/add", productData);
    return response.data;
};

export const updateProduct = async (id, productData) => {
    const response = await api.put(`/products/${id}`, productData);
    return response.data;
};

export const deleteProduct = async (id) => {
    const response = await api.delete(`/products/${id}`);
    return response.data;
};