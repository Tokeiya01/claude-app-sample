import { cn } from '@/lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline';
  size?: 'sm' | 'md' | 'lg';
}

export function Button({ children, className, variant = 'primary', size = 'md', ...props }: ButtonProps) {
  const base = 'inline-flex items-center justify-center rounded-xl font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed';
  const variants = {
    primary:   'bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white shadow-sm',
    secondary: 'bg-gray-100 hover:bg-gray-200 active:bg-gray-300 text-gray-800',
    ghost:     'bg-transparent hover:bg-gray-100 text-gray-700',
    danger:    'bg-red-600 hover:bg-red-700 text-white shadow-sm',
    outline:   'border-2 border-blue-600 text-blue-600 hover:bg-blue-50',
  };
  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-5 py-3 text-base',
    lg: 'px-7 py-4 text-lg',
  };
  return (
    <button className={cn(base, variants[variant], sizes[size], className)} {...props}>
      {children}
    </button>
  );
}
