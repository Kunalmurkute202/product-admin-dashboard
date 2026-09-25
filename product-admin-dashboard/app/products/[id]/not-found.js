import Link from "next/link";

export default function NotFound() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] bg-white rounded-lg shadow border border-gray-200 p-8 text-center">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">404</h2>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">Product Not Found</h3>
            <p className="text-gray-500 mb-6">The product you are looking for does not exist or has been removed.</p>
            <Link
                href="/products"
                className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
                Back to Products
            </Link>
        </div>
    );
}