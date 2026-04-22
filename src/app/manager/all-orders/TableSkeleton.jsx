export default function TableSkeleton() {
    return (
        <div className="p-6 container mx-auto animate-pulse">
            <div className="flex justify-between mb-8">
                <div className="h-10 bg-gray-200 rounded-2xl w-48"></div>
                <div className="h-12 bg-gray-200 rounded-2xl w-40"></div>
            </div>
            <div className="h-16 bg-gray-200 rounded-3xl mb-6 w-full"></div>
            <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden">
                {[...Array(6)].map((_, i) => (
                    <div key={i} className="p-6 border-b border-gray-50 flex justify-between">
                        <div className="space-y-2">
                            <div className="h-4 bg-gray-200 rounded w-24"></div>
                            <div className="h-3 bg-gray-100 rounded w-16"></div>
                        </div>
                        <div className="space-y-2">
                            <div className="h-4 bg-gray-200 rounded w-32"></div>
                            <div className="h-3 bg-gray-100 rounded w-20"></div>
                        </div>
                        <div className="h-8 bg-gray-100 rounded-full w-20"></div>
                        <div className="flex gap-2">
                            <div className="h-10 w-10 bg-gray-100 rounded-xl"></div>
                            <div className="h-10 w-10 bg-gray-100 rounded-xl"></div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}