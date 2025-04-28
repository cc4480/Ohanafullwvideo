import { cn } from "@/lib/utils";

interface SkeletonProps {
  /**
   * Optional className for the skeleton
   */
  className?: string;
  
  /**
   * Width of the skeleton
   * Can be a CSS value (e.g., '100px', '50%') or 'full'
   */
  width?: string | 'full';
  
  /**
   * Height of the skeleton
   * Can be a CSS value (e.g., '20px', '3rem')
   */
  height?: string;
  
  /**
   * Optional border radius for the skeleton
   * Can be 'none', 'sm', 'md', 'lg', 'full'
   */
  radius?: 'none' | 'sm' | 'md' | 'lg' | 'full';
  
  /**
   * Whether to animate the skeleton
   * @default true
   */
  animate?: boolean;
  
  /**
   * Optional aspect ratio to maintain
   * Format: 'width/height' (e.g., '16/9', '1/1')
   */
  aspectRatio?: string;
}

/**
 * Responsive, lightweight skeleton loader component
 * Used to indicate loading state for content without causing layout shifts
 */
export function Skeleton({
  className,
  width = 'full',
  height = '20px',
  radius = 'md',
  animate = true,
  aspectRatio,
  ...props
}: SkeletonProps) {
  // Map radius values to CSS classes
  const radiusMap = {
    'none': 'rounded-none',
    'sm': 'rounded-sm',
    'md': 'rounded',
    'lg': 'rounded-lg',
    'full': 'rounded-full',
  };
  
  // Build width class
  const widthClass = width === 'full' ? 'w-full' : '';
  
  // Build style
  const style: React.CSSProperties = {
    ...(width !== 'full' ? { width } : {}),
    height,
    ...(aspectRatio ? { aspectRatio } : {}),
  };
  
  return (
    <div
      className={cn(
        "bg-gray-200 dark:bg-gray-700", 
        animate && "animate-pulse",
        radiusMap[radius],
        widthClass,
        className
      )}
      style={style}
      aria-hidden="true"
      {...props}
    />
  );
}

/**
 * PropertyCardSkeleton component to show while property data is loading
 */
export function PropertyCardSkeleton() {
  return (
    <div className="property-card-skeleton border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden">
      <Skeleton height="240px" radius="none" className="skeleton-image" />
      <div className="p-4 space-y-3">
        <Skeleton height="24px" width="80%" radius="md" />
        <Skeleton height="18px" width="60%" radius="sm" />
        <div className="flex justify-between pt-2">
          <Skeleton height="16px" width="40%" radius="sm" />
          <Skeleton height="16px" width="30%" radius="sm" />
        </div>
      </div>
    </div>
  );
}

/**
 * PropertiesGridSkeleton to show while properties list is loading
 */
export function PropertiesGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, index) => (
        <PropertyCardSkeleton key={`skeleton-${index}`} />
      ))}
    </div>
  );
}

export default Skeleton;