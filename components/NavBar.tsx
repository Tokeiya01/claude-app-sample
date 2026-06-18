'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Calendar, Trophy, Target, BarChart2 } from 'lucide-react';
import { cn } from '@/lib/utils';

const NAV = [
  { href: '/',         label: 'ホーム',   icon: Home },
  { href: '/daily',    label: '今日の練習', icon: Calendar },
  { href: '/mock',     label: '模試',     icon: Trophy },
  { href: '/weak',     label: '弱点克服', icon: Target },
  { href: '/analysis', label: '分析',     icon: BarChart2 },
];

export default function NavBar() {
  const pathname = usePathname();
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-lg">
      <div className="max-w-lg mx-auto flex safe-area-inset-bottom">
        {NAV.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || (href !== '/' && pathname.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex-1 flex flex-col items-center pt-2 pb-3 gap-1 transition-colors min-w-0',
                active ? 'text-blue-600' : 'text-gray-400 hover:text-gray-600'
              )}
            >
              <Icon size={22} strokeWidth={active ? 2.5 : 1.8} />
              <span className={cn('text-xs font-medium leading-none', active ? 'font-bold' : '')}>
                {label}
              </span>
              {active && (
                <span className="absolute top-0 w-8 h-0.5 bg-blue-600 rounded-full" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
