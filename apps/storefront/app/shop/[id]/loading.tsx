export default function ProductDetailLoading() {
  return (
    <div className="section-padding container-luxury">
      {/* Breadcrumb skeleton */}
      <div className="flex items-center gap-2 mb-8 md:mb-12">
        <div className="h-4 w-10 skeleton rounded" />
        <div className="h-4 w-2 skeleton rounded" />
        <div className="h-4 w-10 skeleton rounded" />
        <div className="h-4 w-2 skeleton rounded" />
        <div className="h-4 w-40 skeleton rounded" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
        {/* Image skeleton */}
        <div className="space-y-3">
          <div className="aspect-square skeleton rounded-2xl" />
          <div className="flex gap-2">
            {[0, 1, 2].map((i) => (
              <div key={i} className="w-16 h-16 skeleton rounded-lg" />
            ))}
          </div>
        </div>

        {/* Info skeleton */}
        <div className="space-y-4">
          <div className="h-3 w-20 skeleton rounded" />
          <div className="h-10 w-3/4 skeleton rounded" />
          <div className="h-6 w-20 skeleton rounded-full" />

          <div className="bg-onyx-50 rounded-xl p-5 space-y-2">
            <div className="h-9 w-36 skeleton rounded" />
            <div className="h-4 w-56 skeleton rounded" />
            <div className="h-3 w-16 skeleton rounded" />
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="h-4 w-16 skeleton rounded" />
              <div className="h-10 w-32 skeleton rounded" />
            </div>
            <div className="h-12 w-full skeleton rounded" />
          </div>

          <div className="pt-8 mt-8 border-t border-onyx-100 space-y-3">
            <div className="h-6 w-40 skeleton rounded" />
            <div className="h-4 w-full skeleton rounded" />
            <div className="h-4 w-5/6 skeleton rounded" />
            <div className="h-4 w-4/6 skeleton rounded" />
          </div>
        </div>
      </div>
    </div>
  );
}
