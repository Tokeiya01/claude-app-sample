import { cn } from '@/lib/utils';

export function Badge({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={cn('inline-flex items-center px-2.5 py-1 rounded-lg text-sm font-semibold', className)}>
      {children}
    </span>
  );
}
