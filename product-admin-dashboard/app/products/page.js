"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { getProducts, addProduct, updateProduct, deleteProduct } from "../../services/productService";
import Pagination from "../../components/Pagination";
import FilterBar from "../../components/FilterBar";
import ProductFormModal from "../../components/ProductFormModal";
import ConfirmModal from "../../components/ConfirmModal";
import { Edit2, Trash2, Plus } from "lucide-react";

export default function ProductsPage() {
    const searchParams = useSearchParams();
    const [products, setProducts] = useState([]);
    const [total, setTotal] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");

    // Modal & Mutation States
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [deletingProductId, setDeletingProductId] = useState(null);
    const [isMutating, setIsMutating] = useState(false);

    const pageParam = searchParams.get("page");
    const limitParam = searchParams.get("limit");
    const searchParam = searchParams.get("search") || "";
    const categoryParam = searchParams.get("category") || "";
    const sortByParam = searchParams.get("sortBy") || "";
    const orderParam = searchParams.get("order") || "asc";

    let page = parseInt(pageParam) || 1;
    if (page < 1) page = 1;
    const limit = parseInt(limitParam) || 10;
    const skip = (page - 1) * limit;

    useEffect(() => {
        const controller = new AbortController();
        const fetchProducts = async () => {
            setIsLoading(true);
            setError("");
            try {
                const data = await getProducts(limit, skip, searchParam, categoryParam, sortByParam, orderParam, controller.signal);
                if (data.products.length === 0 && page > 1) {
                    setProducts([]);
                    setTotal(data.total || 0);
                } else {
                    setProducts(data.products);
                    setTotal(data.total || 0);
                }
            } catch (err) {
                if (err.name !== "CanceledError" && err.message !== "canceled") {
                    setError("Failed to load products. Please try again.");
                }
            } finally {
                setIsLoading(false);
            }
        };
        fetchProducts();
        return () => controller.abort();
    }, [page, limit, searchParam, categoryParam, sortByParam, orderParam]);

    // --- CRUD Handlers ---

    const handleSaveProduct = async (formData) => {
        if (isMutating) return;
        setIsMutating(true);
        try {
            if (editingProduct) {
                await updateProduct(editingProduct.id, formData);
                setProducts(products.map(p => p.id === editingProduct.id ? { ...p, ...formData } : p));
            } else {
                const newProduct = await addProduct(formData);
                // Change is here: we now merge the user's formData (which includes thumbnail and rating)
                setProducts([{ ...newProduct, id: Date.now(), ...formData }, ...products]);
            }
            setIsFormOpen(false);
        } catch (err) {
            alert("Failed to save product.");
        } finally {
            setIsMutating(false);
        }
    };

    const handleConfirmDelete = async () => {
        if (isMutating) return;
        setIsMutating(true);
        try {
            await deleteProduct(deletingProductId);
            // Local State Patch: Remove from array
            setProducts(products.filter(p => p.id !== deletingProductId));
            setIsDeleteOpen(false);
        } catch (err) {
            alert("Failed to delete product.");
        } finally {
            setIsMutating(false);
        }
    };

    const openEditModal = (product) => {
        setEditingProduct(product);
        setIsFormOpen(true);
    };

    const openAddModal = () => {
        setEditingProduct(null);
        setIsFormOpen(true);
    };

    const openDeleteModal = (id) => {
        setDeletingProductId(id);
        setIsDeleteOpen(true);
    };

    return (
        <div className="space-y-6 relative">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h2 className="text-2xl font-bold">Product Management</h2>
                <button
                    onClick={openAddModal}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center gap-2"
                >
                    <Plus size={18} /> Add Product
                </button>
            </div>

            <FilterBar />

            {isLoading && products.length > 0 && (
                <div className="absolute inset-0 bg-white/50 flex justify-center items-center z-10 rounded-lg">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
            )}

            {isLoading && products.length === 0 ? (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
            ) : error ? (
                <div className="text-center p-8 bg-red-50 rounded-lg">
                    <p className="text-red-600 mb-4">{error}</p>
                    <button onClick={() => window.location.reload()} className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">
                        Retry
                    </button>
                </div>
            ) : (
                <>
                    {/* Mobile Card View */}
                    <div className="grid grid-cols-1 gap-4 md:hidden">
                        {products.map((product) => (
                            <div key={product.id} className="bg-white p-4 rounded-lg shadow border border-gray-200">
                                <div className="flex items-center space-x-4 mb-3">
                                    <img src={product.thumbnail} alt={product.title} className="w-16 h-16 object-cover rounded" />
                                    <div className="flex-1">
                                        <Link href={`/products/${product.id}`} className="font-bold text-lg hover:text-blue-600 hover:underline">
                                            {product.title}
                                        </Link>
                                        <span className="block text-xs bg-gray-200 px-2 py-1 rounded w-fit mt-1 text-gray-700">{product.category}</span>
                                    </div>
                                </div>
                                <div className="flex justify-between text-sm text-gray-600 mb-3 border-b border-gray-100 pb-3">
                                    <p>Price: <span className="font-bold text-black">${product.price}</span></p>
                                    <p>Rating: {product.rating} ⭐</p>
                                    <p>Stock: {product.stock}</p>
                                </div>
                                <div className="flex justify-end gap-3">
                                    <button onClick={() => openEditModal(product)} className="text-blue-600 p-1 hover:bg-blue-50 rounded">
                                        <Edit2 size={18} />
                                    </button>
                                    <button onClick={() => openDeleteModal(product.id)} className="text-red-600 p-1 hover:bg-red-50 rounded">
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Desktop Table View */}
                    <div className="hidden md:block overflow-x-auto bg-white rounded-lg shadow border border-gray-200">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rating</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {products.map((product) => (
                                    <tr key={product.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap flex items-center space-x-3">
                                            <img src={product.thumbnail} alt={product.title} className="w-10 h-10 object-cover rounded" />
                                            <Link href={`/products/${product.id}`} className="font-medium hover:text-blue-600 hover:underline">
                                                {product.title}
                                            </Link>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.category}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">${product.price}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.rating}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.stock}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-right space-x-3">
                                            <button onClick={() => openEditModal(product)} className="text-blue-600 hover:text-blue-800">
                                                <Edit2 size={18} className="inline" />
                                            </button>
                                            <button onClick={() => openDeleteModal(product.id)} className="text-red-600 hover:text-red-800">
                                                <Trash2 size={18} className="inline" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {products.length === 0 && (
                        <div className="text-center p-8 text-gray-500 bg-white rounded-lg border border-gray-200">
                            No products found matching your criteria.
                        </div>
                    )}

                    <Pagination total={total} currentLimit={limit} currentSkip={skip} />
                </>
            )}

            {/* Modals */}
            <ProductFormModal
                isOpen={isFormOpen}
                onClose={() => setIsFormOpen(false)}
                onSubmit={handleSaveProduct}
                initialData={editingProduct}
                isLoading={isMutating}
            />

            <ConfirmModal
                isOpen={isDeleteOpen}
                onClose={() => setIsDeleteOpen(false)}
                onConfirm={handleConfirmDelete}
                title="Delete Product"
                message="Are you sure you want to delete this product? This action cannot be undone."
                isLoading={isMutating}
            />
        </div>
    );
}