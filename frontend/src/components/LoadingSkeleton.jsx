const SkeletonBlock = ({ className = '' }) => (
  <div
    aria-hidden="true"
    className={`animate-pulse rounded-xl bg-white/10 ${className}`}
  />
);

export const LoadingStatus = ({ message = 'Loading content' }) => (
  <p className="sr-only" role="status" aria-live="polite">
    {message}
  </p>
);

export const DashboardStatsSkeleton = () => (
  <div aria-busy="true" className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
    <LoadingStatus message="Loading dashboard statistics" />
    {Array.from({ length: 4 }).map((_, index) => (
      <div
        key={index}
        className="rounded-2xl border border-white/10 bg-white/5 p-4"
      >
        <div className="flex items-center justify-between mb-4">
          <SkeletonBlock className="h-10 w-10 rounded-full" />
          <SkeletonBlock className="h-4 w-16" />
        </div>
        <SkeletonBlock className="h-7 w-20 mb-3" />
        <SkeletonBlock className="h-3 w-28" />
      </div>
    ))}
  </div>
);

export const CardGridSkeleton = ({ count = 4, columns = 'lg:grid-cols-4' }) => (
  <div aria-busy="true" className={`grid grid-cols-1 sm:grid-cols-2 ${columns} gap-4`}>
    <LoadingStatus message="Loading cards" />
    {Array.from({ length: count }).map((_, index) => (
      <div
        key={index}
        className="rounded-2xl border border-white/10 bg-white/5 p-5"
      >
        <div className="flex items-center gap-3 mb-4">
          <SkeletonBlock className="h-11 w-11 rounded-full" />
          <div className="flex-1">
            <SkeletonBlock className="h-4 w-3/4 mb-2" />
            <SkeletonBlock className="h-3 w-1/2" />
          </div>
        </div>
        <SkeletonBlock className="h-2 w-full mb-4" />
        <div className="flex justify-between">
          <SkeletonBlock className="h-3 w-16" />
          <SkeletonBlock className="h-3 w-12" />
        </div>
      </div>
    ))}
  </div>
);

export const PlannerSkeleton = ({ rows = 3 }) => (
  <div
    aria-busy="true"
    className="mb-6 rounded-2xl border border-white/10 bg-white/5 p-5"
  >
    <LoadingStatus message="Loading daily planner" />
    <div className="flex items-center justify-between mb-5">
      <div>
        <SkeletonBlock className="h-5 w-44 mb-2" />
        <SkeletonBlock className="h-3 w-32" />
      </div>
      <SkeletonBlock className="h-9 w-24" />
    </div>
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, index) => (
        <div
          key={index}
          className="rounded-xl border border-white/10 bg-black/20 p-3"
        >
          <div className="flex items-start gap-3">
            <SkeletonBlock className="h-10 w-14" />
            <div className="flex-1">
              <SkeletonBlock className="h-4 w-2/3 mb-2" />
              <SkeletonBlock className="h-3 w-1/3" />
            </div>
            <SkeletonBlock className="h-9 w-9 rounded-lg" />
          </div>
        </div>
      ))}
    </div>
  </div>
);
