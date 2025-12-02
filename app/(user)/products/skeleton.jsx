// components/shared/products/productsLoadingSkeleton.jsx
export default function ProductsLoadingSkeleton() {
  return (
    <main className="max-w-[1400px] mx-auto px-6 py-10">
      {/* Header Skeleton */}
      <div className="mb-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="h-10 w-64 bg-taupe/20 rounded-lg animate-pulse mb-2" />
          <div className="h-4 w-32 bg-taupe/20 rounded animate-pulse" />
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="hidden md:block h-10 w-80 bg-taupe/20 rounded-full animate-pulse" />
          <div className="h-10 w-24 bg-taupe/20 rounded-full animate-pulse" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Skeleton */}
        <div className="hidden lg:block">
          <div className="space-y-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="space-y-3">
                <div className="h-6 w-32 bg-taupe/20 rounded animate-pulse" />
                <div className="space-y-2">
                  {[1, 2, 3].map((j) => (
                    <div
                      key={j}
                      className="h-4 w-full bg-taupe/20 rounded animate-pulse"
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Products Grid Skeleton */}
        <div className="lg:col-span-3">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="space-y-3">
                <div className="aspect-[3/4] bg-taupe/20 rounded-2xl animate-pulse" />
                <div className="h-4 w-3/4 bg-taupe/20 rounded animate-pulse" />
                <div className="h-5 w-1/2 bg-taupe/20 rounded animate-pulse" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
