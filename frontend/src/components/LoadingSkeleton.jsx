import Card from './Card';

const shimmer =
  'relative overflow-hidden before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_1.6s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent';

export const SkeletonBlock = ({ className = '' }) => (
  <div className={`${shimmer} rounded-lg bg-white/10 ${className}`} aria-hidden="true" />
);

export const SkeletonCard = ({ className = '', children }) => (
  <Card className={`bg-white/5 border border-white/10 backdrop-blur-xl ${className}`}>
    {children}
  </Card>
);

export const DashboardStatsSkeleton = () => (
  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6" aria-busy="true" aria-live="polite">
    {Array.from({ length: 4 }).map((_, index) => (
      <SkeletonCard key={index}>
        <div className="flex items-center justify-between">
          <div className="space-y-3">
            <SkeletonBlock className="h-3 w-20" />
            <SkeletonBlock className="h-7 w-14" />
          </div>
          <SkeletonBlock className="h-11 w-11 rounded-xl" />
        </div>
      </SkeletonCard>
    ))}
  </div>
);

export const AnalyticsSkeleton = () => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6" aria-busy="true" aria-live="polite">
    {Array.from({ length: 3 }).map((_, index) => (
      <SkeletonCard key={index} className="min-h-[260px]">
        <SkeletonBlock className="h-5 w-36 mb-8" />
        <div className="flex justify-center">
          <SkeletonBlock className="h-36 w-36 rounded-full" />
        </div>
      </SkeletonCard>
    ))}
  </div>
);

export const TrackerGridSkeleton = ({ count = 4 }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4" aria-busy="true" aria-live="polite">
    {Array.from({ length: count }).map((_, index) => (
      <SkeletonCard key={index} className="min-h-[190px]">
        <div className="space-y-4">
          <SkeletonBlock className="h-12 w-12 rounded-xl" />
          <SkeletonBlock className="h-5 w-2/3" />
          <SkeletonBlock className="h-3 w-full" />
          <SkeletonBlock className="h-3 w-5/6" />
          <SkeletonBlock className="h-2 w-full rounded-full" />
        </div>
      </SkeletonCard>
    ))}
  </div>
);

export const PlannerSkeleton = () => (
  <div className="space-y-6" aria-busy="true" aria-live="polite">
    <div className="grid grid-cols-2 gap-4">
      <SkeletonCard>
        <SkeletonBlock className="h-4 w-32 mx-auto mb-5" />
        <SkeletonBlock className="h-28 w-28 rounded-full mx-auto" />
      </SkeletonCard>
      <SkeletonCard>
        <SkeletonBlock className="h-4 w-28 mx-auto mb-5" />
        <SkeletonBlock className="h-28 w-28 rounded-full mx-auto" />
      </SkeletonCard>
    </div>
    <SkeletonCard className="space-y-4">
      <div className="flex gap-2">
        <SkeletonBlock className="h-11 flex-1" />
        <SkeletonBlock className="h-11 flex-1" />
      </div>
      {Array.from({ length: 4 }).map((_, index) => (
        <SkeletonBlock key={index} className="h-16 w-full" />
      ))}
    </SkeletonCard>
  </div>
);
