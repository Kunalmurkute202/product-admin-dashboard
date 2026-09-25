"use client";

import { useState, useEffect } from "react";
import { notFound } from "next/navigation";
import { getProductById } from "../../../services/productService";
import Link from "next/link";

export default function ProductDetailsPage({ params }) {
    const [product, setProduct] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");
    const [isNotFound, setIsNotFound] = useState(false); // Track the 404 state locally

    useEffect(() => {
        const fetchProduct = async () => {
            setIsLoading(true);
            try {
                const resolvedParams = await params;
                const data = await getProductById(resolvedParams.id);
                setProduct(data);
            } catch (err) {
                if (err.response?.status === 404) {
                    // Set state to true instead of calling notFound() directly in the effect
                    setIsNotFound(true);
                } else {
                    setError("Failed to load product details.");
                }
            } finally {
                setIsLoading(false);
            }
        };

        fetchProduct();
    }, [params]);

    // Trigger the Next.js not-found boundary during the render phase
    if (isNotFound) {
        notFound();
    }

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center p-8 bg-red-50 rounded-lg">
                <p className="text-red-600 mb-4">{error}</p>
                <button onClick={() => window.location.reload()} className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">
                    Retry
                </button>
            </div>
        );
    }

    if (!product) return null;

    return (
        <div className="space-y-6">
            <Link href="/products" className="text-blue-600 hover:underline flex items-center gap-2 w-fit">
                ← Back to Products
            </Link>

            <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
                <div className="md:flex">
                    <div className="md:w-1/2 bg-gray-100 p-8 flex flex-col items-center justify-center">
                        <img
                            src={product?.images?.[0] || product?.thumbnail}
                            alt={product?.title}
                            className="max-h-96 object-contain mix-blend-multiply"
                        />
                        {product?.images?.length > 1 && (
                            <div className="flex gap-2 mt-4 overflow-x-auto p-2">
                                {product.images.map((img, idx) => (
                                    <img key={idx} src={img} alt={`View ${idx + 1}`} className="w-16 h-16 object-cover rounded border border-gray-300 bg-white" />
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="md:w-1/2 p-8 space-y-4">
                        <div className="flex justify-between items-start">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900">{product?.title}</h1>
                                <p className="text-sm text-gray-500 uppercase tracking-wide mt-1">{product?.brand} • {product?.category}</p>
                            </div>
                            <span className="text-2xl font-bold text-blue-600">${product?.price}</span>
                        </div>

                        <p className="text-gray-700 text-lg">{product?.description}</p>

                        <div className="flex items-center gap-4 py-4 border-y border-gray-200">
                            <div className="text-sm">
                                <span className="font-semibold block text-gray-900">Rating</span>
                                <span className="text-gray-600">{product?.rating} ⭐</span>
                            </div>
                            <div className="text-sm border-l border-gray-200 pl-4">
                                <span className="font-semibold block text-gray-900">Stock</span>
                                <span className={`${product?.stock > 10 ? 'text-green-600' : 'text-red-600'}`}>
                                    {product?.stock} available
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}