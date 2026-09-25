"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { getCategories } from "../services/productService";

export default function FilterBar() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const [categories, setCategories] = useState([]);
    const [searchTerm, setSearchTerm] = useState(searchParams.get("search") || "");
    const [category, setCategory] = useState(searchParams.get("category") || "all");
    const [sortBy, setSortBy] = useState(searchParams.get("sortBy") || "");
    const [order, setOrder] = useState(searchParams.get("order") || "asc");

    // Fetch categories on mount
    useEffect(() => {
        const fetchCats = async () => {
            try {
                const data = await getCategories();
                // DummyJSON returns an array of objects for categories: [{ slug: "beauty", name: "Beauty", ... }]
                setCategories(data);
            } catch (err) {
                console.error("Failed to load categories", err);
            }
        };
        fetchCats();
    }, []);

    // Update URL helper
    const updateURL = (key, value, clearKey = null) => {
        const params = new URLSearchParams(searchParams.toString());

        if (value && value !== "all") {
            params.set(key, value);
        } else {
            params.delete(key);
        }

        if (clearKey) {
            params.delete(clearKey);
        }

        // Always reset to page 1 when changing filters/sort
        params.set("page", "1");
        router.push(`${pathname}?${params.toString()}`);
    };

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(() => {
            const currentUrlSearch = searchParams.get("search") || "";
            if (searchTerm !== currentUrlSearch) {
                // If typing a search, clear the category to satisfy API limits
                if (searchTerm) setCategory("all");
                updateURL("search", searchTerm, "category");
            }
        }, 500);
        return () => clearTimeout(timer);
    }, [searchTerm]);

    const handleCategoryChange = (e) => {
        const newCat = e.target.value;
        setCategory(newCat);
        // If picking a category, clear the search text to satisfy API limits
        if (newCat !== "all") setSearchTerm("");
        updateURL("category", newCat, "search");
    };

    const handleSortChange = (e) => {
        const val = e.target.value;
        if (!val) {
            setSortBy("");
            updateURL("sortBy", "");
            return;
        }
        const [newSortBy, newOrder] = val.split("-");
        setSortBy(newSortBy);
        setOrder(newOrder);

        const params = new URLSearchParams(searchParams.toString());
        params.set("sortBy", newSortBy);
        params.set("order", newOrder);
        params.set("page", "1");
        router.push(`${pathname}?${params.toString()}`);
    };

    return (
        <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-sm mb-6 space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
                {/* Search */}
                <div className="flex-1">
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search products..."
                        className="w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                    <p className="text-xs text-gray-500 mt-1">Typing a search clears the category filter.</p>
                </div>

                {/* Category Filter */}
                <div className="md:w-48">
                    <select
                        value={category}
                        onChange={handleCategoryChange}
                        className="w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-blue-500 focus:border-blue-500"
                    >
                        <option value="all">All Categories</option>
                        {categories.map((c) => (
                            <option key={c.slug || c} value={c.slug || c}>
                                {c.name || c}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Sort By */}
                <div className="md:w-48">
                    <select
                        value={sortBy ? `${sortBy}-${order}` : ""}
                        onChange={handleSortChange}
                        className="w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-blue-500 focus:border-blue-500"
                    >
                        <option value="">Sort By...</option>
                        <option value="price-asc">Price (Low to High)</option>
                        <option value="price-desc">Price (High to Low)</option>
                        <option value="rating-desc">Rating (Highest)</option>
                        <option value="rating-asc">Rating (Lowest)</option>
                        <option value="title-asc">Title (A-Z)</option>
                        <option value="title-desc">Title (Z-A)</option>
                    </select>
                </div>
            </div>
        </div>
    );
}