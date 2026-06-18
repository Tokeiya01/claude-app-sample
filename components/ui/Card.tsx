import { cn } from '@/lib/utils';

export function Card({ children, className, onClick }: {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}) {
  return (
    <div
      className={cn(
        'bg-white border border-gray-200 rounded-2xl p-5 shadow-sm',
        onClick && 'cursor-pointer hover:shadow-md hover:border-blue-200 transition-all',
        className
      )}
      onClick={onClick}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn('mb-4', className)}>{children}</div>;
}

export function CardTitle({ children, className }: { children: React.ReactNode; className?: string }) {
  return <h3 className={cn('text-lg font-bold text-gray-900', className)}>{children}</h3>;
}
