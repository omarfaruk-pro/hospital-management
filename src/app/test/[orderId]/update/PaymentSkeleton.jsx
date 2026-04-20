export default function PaymentSkeleton() {
    return (
        <div className="bg-bg min-h-screen py-8 px-4 md:px-8 animate-pulse">
            <div className="max-w-7xl mx-auto space-y-8">
                <div className="h-10 bg-gray-200 rounded-xl w-48" />
                <div className="grid grid-cols-12 gap-8">
                    <div className="col-span-4 space-y-6">
                        <div className="h-64 bg-white rounded-3xl border border-gray-100" />
                        <div className="h-80 bg-white rounded-3xl border border-gray-100" />
                    </div>
                    <div className="col-span-8 h-150 bg-white rounded-4xl border border-gray-100" />
                </div>
            </div>
        </div>
    );
}