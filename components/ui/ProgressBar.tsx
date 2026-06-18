import { cn } from '@/lib/utils';

export function ProgressBar({
  value,
  max = 100,
  className,
  barClassName,
  showLabel = false,
}: {
  value: number;
  max?: number;
  className?: string;
  barClassName?: string;
  showLabel?: boolean;
}) {
  const pct = Math.round(Math.min(100, Math.max(0, (value / max) * 100)));
  return (
    <div className={cn('w-full', className)}>
      <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
        <div
          className={cn('h-full rounded-full transition-all duration-300', barClassName ?? 'bg-blue-500')}
          style={{ width: `${pct}%` }}
        />
      </div>
      {showLabel && (
        <div className="text-right text-sm text-gray-500 mt-1">{pct}%</div>
      )}
    </div>
  );
}
