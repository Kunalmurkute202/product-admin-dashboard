"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";

export default function Pagination({ total, currentLimit, currentSkip }) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const currentPage = Math.floor(currentSkip / currentLimit) + 1;
    const totalPages = Math.ceil(total / currentLimit);

    // Calculate the "Showing X-Y" numbers
    const startItem = currentSkip + 1;
    const endItem = Math.min(currentSkip + currentLimit, total);

    // Helper to update the URL
    const updateURL = (newSkip, newLimit) => {
        const params = new URLSearchParams(searchParams.toString());

        // The assignment mentions ?page=... handling, so we'll store page & limit
        const newPage = Math.floor(newSkip / newLimit) + 1;
        params.set("page", newPage.toString());
        params.set("limit", newLimit.toString());

        router.push(`${pathname}?${params.toString()}`);
    };

    const handleNext = () => {
        if (currentPage < totalPages) updateURL(currentSkip + currentLimit, currentLimit);
    };

    const handlePrev = () => {
        if (currentPage > 1) updateURL(currentSkip - currentLimit, currentLimit);
    };

    const handleLimitChange = (e) => {
        const newLimit = parseInt(e.target.value);
        // Reset to page 1 (skip = 0) when changing page size
        updateURL(0, newLimit);
    };

    if (total === 0) return null;

    return (
        <div className="flex flex-col sm:flex-row justify-between items-center bg-white p-4 border border-gray-200 rounded-lg shadow-sm mt-4 gap-4">
            <div className="text-sm text-gray-700">
                Showing <span className="font-semibold">{startItem}</span> - <span className="font-semibold">{endItem}</span> of <span className="font-semibold">{total}</span>
            </div>

            <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                    <label htmlFor="limit" className="text-sm text-gray-600">Per page:</label>
                    <select
                        id="limit"
                        value={currentLimit}
                        onChange={handleLimitChange}
                        className="border border-gray-300 rounded p-1 text-sm focus:ring-blue-500 focus:border-blue-500"
                    >
                        <option value={10}>10</option>
                        <option value={20}>20</option>
                        <option value={50}>50</option>
                    </select>
                </div>

                <div className="flex space-x-2">
                    <button
                        onClick={handlePrev}
                        disabled={currentPage === 1}
                        className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 hover:bg-gray-50 transition-colors"
                    >
                        Previous
                    </button>
                    <span className="px-3 py-1 text-sm flex items-center">
                        Page {currentPage} of {totalPages}
                    </span>
                    <button
                        onClick={handleNext}
                        disabled={currentPage === totalPages}
                        className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 hover:bg-gray-50 transition-colors"
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
}