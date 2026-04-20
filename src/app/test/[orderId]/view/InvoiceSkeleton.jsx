
export default function InvoiceSkeleton() {
  return (
    <section className="bg-bg py-10 min-h-screen animate-pulse">
      <div className="container mx-auto px-4 max-w-4xl">
        
        {/* Main Card Skeleton */}
        <div className="bg-white shadow-xl rounded-3xl overflow-hidden border border-gray-100">
          
          {/* Top Blue Accent Bar */}
          <div className="h-2 bg-primary/20 w-full" />

          <div className="p-8 md:p-12">
            
            {/* Header Branding Skeleton */}
            <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-10 border-b border-gray-100 pb-8">
              <div className="flex items-center gap-4">
                {/* Logo Icon Box */}
                <div className="bg-gray-200 h-16 w-16 rounded-2xl" />
                <div className="space-y-2">
                  <div className="h-6 bg-gray-200 rounded-md w-48" />
                  <div className="h-4 bg-gray-100 rounded-md w-32" />
                  <div className="h-3 bg-gray-100 rounded-md w-24" />
                </div>
              </div>
              <div className="text-right space-y-2 w-full md:w-auto">
                <div className="h-10 bg-gray-100 rounded-md w-32 ml-auto" />
                <div className="h-8 bg-gray-50 rounded-xl w-24 ml-auto border border-gray-100" />
              </div>
            </div>

            {/* Info Grid Skeleton */}
            <div className="grid grid-cols-2 gap-8 mb-10">
              {/* Left Column: Patient Info */}
              <div className="space-y-4">
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-4" /> {/* Section Title */}
                <div className="space-y-3">
                  <div className="flex justify-between md:justify-start gap-4">
                    <div className="h-3 bg-gray-100 rounded w-16" />
                    <div className="h-3 bg-gray-200 rounded w-32" />
                  </div>
                  <div className="flex justify-between md:justify-start gap-4">
                    <div className="h-3 bg-gray-100 rounded w-16" />
                    <div className="h-3 bg-gray-200 rounded w-24" />
                  </div>
                  <div className="flex justify-between md:justify-start gap-4">
                    <div className="h-3 bg-gray-100 rounded w-16" />
                    <div className="h-3 bg-gray-200 rounded w-28" />
                  </div>
                </div>
              </div>

              {/* Right Column: Bill Details */}
              <div className="space-y-4">
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-4" /> {/* Section Title */}
                <div className="space-y-3">
                  <div className="flex justify-between md:justify-start gap-4">
                    <div className="h-3 bg-gray-100 rounded w-16" />
                    <div className="h-3 bg-gray-200 rounded w-32" />
                  </div>
                  <div className="flex justify-between md:justify-start gap-4">
                    <div className="h-3 bg-gray-100 rounded w-16" />
                    <div className="h-3 bg-gray-200 rounded w-20" />
                  </div>
                </div>
              </div>
            </div>

            {/* Test Table Skeleton */}
            <div className="mb-10 border border-gray-100 rounded-2xl overflow-hidden">
              <div className="h-12 bg-gray-50 border-b border-gray-100" /> {/* Table Header */}
              <div className="p-4 space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex justify-between items-center py-2 border-b border-gray-50 last:border-0">
                    <div className="flex gap-4 items-center">
                      <div className="h-4 bg-gray-200 rounded w-4" />
                      <div className="h-4 bg-gray-200 rounded w-48" />
                    </div>
                    <div className="h-4 bg-gray-200 rounded w-16" />
                  </div>
                ))}
              </div>
            </div>

            {/* Summary Area Skeleton */}
            <div className="grid grid-cols-2 gap-10">
              {/* Instructions */}
              <div className="space-y-2">
                <div className="h-20 bg-blue-50/50 rounded-2xl border border-blue-100/50 w-full" />
                <div className="flex gap-2 items-center">
                   <div className="h-10 w-10 bg-gray-100 rounded" />
                   <div className="h-3 bg-gray-100 rounded w-24" />
                </div>
              </div>

              {/* Financial Summary Box */}
              <div className="space-y-3 p-6 bg-white border border-gray-100 rounded-2xl">
                 <div className="flex justify-between">
                   <div className="h-3 bg-gray-100 rounded w-16" />
                   <div className="h-3 bg-gray-200 rounded w-20" />
                 </div>
                 <div className="flex justify-between">
                   <div className="h-3 bg-gray-100 rounded w-20" />
                   <div className="h-3 bg-gray-200 rounded w-12" />
                 </div>
                 <div className="h-px bg-gray-100 w-full my-2" />
                 <div className="flex justify-between">
                   <div className="h-6 bg-gray-100 rounded w-24" />
                   <div className="h-8 bg-gray-200 rounded w-28" />
                 </div>
                 <div className="h-10 bg-red-50/50 rounded-xl w-full" />
              </div>
            </div>

            {/* Signature Area Skeleton */}
            <div className="mt-16 flex justify-between items-end border-t border-gray-100 pt-8">
               <div className="text-center space-y-2">
                  <div className="w-24 h-px bg-gray-200" />
                  <div className="h-2 bg-gray-100 rounded w-16 mx-auto" />
               </div>
               <div className="text-center space-y-2">
                  <div className="w-32 h-0.5 bg-primary/10" />
                  <div className="h-2 bg-gray-100 rounded w-20 mx-auto" />
               </div>
            </div>

          </div>
        </div>
        
        {/* Button Placeholder */}
        <div className="mt-8 flex justify-center">
          <div className="h-12 bg-gray-200 rounded-2xl w-48" />
        </div>

      </div>
    </section>
  );
}