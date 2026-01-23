'use client';

import { cn } from '@/lib/utils';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular' | 'card' | 'module';
  width?: string | number;
  height?: string | number;
  lines?: number;
  animate?: boolean;
}

export function Skeleton({
  className,
  variant = 'rectangular',
  width,
  height,
  lines = 1,
  animate = true,
}: SkeletonProps) {
  const baseClasses = cn(
    'bg-cyber-800/50 rounded',
    animate && 'animate-pulse',
  );

  const style = {
    width: typeof width === 'number' ? `${width}px` : width,
    height: typeof height === 'number' ? `${height}px` : height,
  };

  if (variant === 'text') {
    return (
      <div className={cn('space-y-2', className)}>
        {Array.from({ length: lines }).map((_, i) => (
          <div
            key={i}
            className={cn(
              baseClasses,
              'h-4',
              i === lines - 1 && lines > 1 && 'w-3/4'
            )}
            style={i === 0 ? style : undefined}
          />
        ))}
      </div>
    );
  }

  if (variant === 'circular') {
    return (
      <div
        className={cn(baseClasses, 'rounded-full', className)}
        style={{ ...style, aspectRatio: '1/1' }}
      />
    );
  }

  if (variant === 'card') {
    return (
      <div className={cn('cyber-card p-6 space-y-4', className)}>
        <Skeleton variant="rectangular" height={160} className="rounded-lg" />
        <Skeleton variant="text" lines={1} width="60%" />
        <Skeleton variant="text" lines={2} />
        <div className="flex gap-2">
          <Skeleton variant="rectangular" width={60} height={24} className="rounded-full" />
          <Skeleton variant="rectangular" width={80} height={24} className="rounded-full" />
        </div>
      </div>
    );
  }

  if (variant === 'module') {
    return (
      <div className={cn('cyber-card overflow-hidden', className)}>
        {/* Image skeleton */}
        <div className="relative h-40">
          <div className={cn(baseClasses, 'absolute inset-0 rounded-none')} />
          {/* Badge skeletons */}
          <div className="absolute top-3 left-3">
            <Skeleton variant="rectangular" width={70} height={24} className="rounded-full" />
          </div>
          <div className="absolute top-3 right-3">
            <Skeleton variant="circular" width={32} height={32} />
          </div>
        </div>
        {/* Content skeleton */}
        <div className="p-5 space-y-4">
          <Skeleton variant="text" lines={1} width="80%" height={24} />
          <Skeleton variant="text" lines={2} />
          <div className="flex items-center gap-3">
            <Skeleton variant="rectangular" width={60} height={16} className="rounded" />
            <Skeleton variant="rectangular" width={80} height={16} className="rounded" />
          </div>
          <div className="flex gap-2">
            <Skeleton variant="rectangular" width={70} height={22} className="rounded" />
            <Skeleton variant="rectangular" width={60} height={22} className="rounded" />
            <Skeleton variant="rectangular" width={80} height={22} className="rounded" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn(baseClasses, className)} style={style} />
  );
}

// Preset skeleton layouts
export function ModuleGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <Skeleton key={i} variant="module" />
      ))}
    </div>
  );
}

export function LeaderboardSkeleton({ count = 10 }: { count?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="cyber-card p-4 flex items-center gap-4">
          <Skeleton variant="rectangular" width={30} height={24} />
          <Skeleton variant="circular" width={40} height={40} />
          <div className="flex-1 space-y-2">
            <Skeleton variant="text" width="40%" />
            <Skeleton variant="text" width="60%" height={12} />
          </div>
          <Skeleton variant="rectangular" width={60} height={24} />
        </div>
      ))}
    </div>
  );
}

export function ProgressStatsSkeleton() {
  return (
    <div className="cyber-card p-6 space-y-6">
      {/* Level section */}
      <div className="text-center space-y-3">
        <Skeleton variant="circular" width={80} height={80} className="mx-auto" />
        <Skeleton variant="text" width="50%" className="mx-auto" />
        <Skeleton variant="rectangular" height={8} className="rounded-full" />
      </div>
      
      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-cyber-800/30 rounded-lg p-3 space-y-2">
            <Skeleton variant="text" width="60%" height={12} />
            <Skeleton variant="text" width="40%" height={24} />
          </div>
        ))}
      </div>
      
      {/* Badges section */}
      <div className="space-y-3">
        <Skeleton variant="text" width="30%" />
        <div className="flex gap-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} variant="circular" width={40} height={40} />
          ))}
        </div>
      </div>
    </div>
  );
}

export function ChatSkeleton() {
  return (
    <div className="space-y-4 p-4">
      {/* Assistant message */}
      <div className="flex items-start gap-3">
        <Skeleton variant="circular" width={32} height={32} />
        <div className="space-y-2 flex-1">
          <Skeleton variant="rectangular" height={60} className="rounded-2xl max-w-[75%]" />
        </div>
      </div>
      
      {/* User message */}
      <div className="flex items-start gap-3 flex-row-reverse">
        <Skeleton variant="circular" width={32} height={32} />
        <div className="space-y-2">
          <Skeleton variant="rectangular" width={200} height={40} className="rounded-2xl" />
        </div>
      </div>
      
      {/* Assistant message */}
      <div className="flex items-start gap-3">
        <Skeleton variant="circular" width={32} height={32} />
        <div className="space-y-2 flex-1">
          <Skeleton variant="rectangular" height={80} className="rounded-2xl max-w-[75%]" />
        </div>
      </div>
    </div>
  );
}

export function DashboardStatsSkeleton() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="cyber-card p-4 space-y-2">
          <Skeleton variant="circular" width={40} height={40} />
          <Skeleton variant="text" width="60%" height={28} />
          <Skeleton variant="text" width="40%" height={12} />
        </div>
      ))}
    </div>
  );
}

export default Skeleton;
