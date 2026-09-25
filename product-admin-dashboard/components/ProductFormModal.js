import { useState, useEffect } from "react";

export default function ProductFormModal({ isOpen, onClose, onSubmit, initialData, isLoading }) {
    const [formData, setFormData] = useState({
        title: "",
        category: "beauty",
        price: "",
        stock: "",
        rating: "",
        thumbnail: "",
    });
    const [error, setError] = useState("");

    useEffect(() => {
        if (initialData) {
            setFormData({
                title: initialData.title || "",
                category: initialData.category || "beauty",
                price: initialData.price || "",
                stock: initialData.stock || "",
                rating: initialData.rating || "",
                thumbnail: initialData.thumbnail || "",
            });
        } else {
            setFormData({ title: "", category: "beauty", price: "", stock: "", rating: "", thumbnail: "" });
        }
    }, [initialData, isOpen]);

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        setError("");

        if (!formData.title.trim()) return setError("Title is required.");
        if (formData.price <= 0) return setError("Price must be greater than 0.");
        if (formData.stock < 0) return setError("Stock cannot be negative.");
        if (formData.rating < 0 || formData.rating > 5) return setError("Rating must be between 0 and 5.");
        if (!formData.thumbnail.trim()) return setError("Image URL is required.");

        onSubmit(formData);
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 max-h-[90vh] overflow-y-auto">
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                    {initialData ? "Edit Product" : "Add Product"}
                </h3>

                {error && <p className="text-red-600 text-sm mb-4 bg-red-50 p-2 rounded">{error}</p>}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Title</label>
                        <input
                            type="text"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            className="mt-1 w-full border border-gray-300 rounded p-2 focus:ring-blue-500"
                            required
                        />
                    </div>

                    {/* ADD THIS CATEGORY DROPDOWN */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Category</label>
                        <select
                            value={formData.category}
                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                            className="mt-1 w-full border border-gray-300 rounded p-2 focus:ring-blue-500"
                        >
                            <option value="beauty">Beauty</option>
                            <option value="fragrances">Fragrances</option>
                            <option value="furniture">Furniture</option>
                            <option value="groceries">Groceries</option>
                            <option value="laptops">Laptops</option>
                            <option value="smartphones">Smartphones</option>
                        </select>
                    </div>

                    {/* Keep your Thumbnail, Price, Stock, Rating inputs below this... */}

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Image URL (Thumbnail)</label>
                        <input
                            type="url"
                            value={formData.thumbnail}
                            onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })}
                            placeholder="https://example.com/image.jpg"
                            className="mt-1 w-full border border-gray-300 rounded p-2 focus:ring-blue-500"
                            required
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Price ($)</label>
                            <input
                                type="number"
                                step="0.01"
                                value={formData.price}
                                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                className="mt-1 w-full border border-gray-300 rounded p-2 focus:ring-blue-500"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Stock</label>
                            <input
                                type="number"
                                value={formData.stock}
                                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                                className="mt-1 w-full border border-gray-300 rounded p-2 focus:ring-blue-500"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Rating (0-5)</label>
                            <input
                                type="number"
                                step="0.1"
                                min="0"
                                max="5"
                                value={formData.rating}
                                onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
                                className="mt-1 w-full border border-gray-300 rounded p-2 focus:ring-blue-500"
                                required
                            />
                        </div>
                    </div>

                    <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 mt-6">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={isLoading}
                            className="px-4 py-2 text-gray-700 bg-gray-100 rounded hover:bg-gray-200"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700 disabled:opacity-50"
                        >
                            {isLoading ? "Saving..." : "Save"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}