'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, BookOpen, BarChart2, Trophy, Newspaper } from 'lucide-react';
import { cn } from '@/lib/utils';

const NAV = [
  { href: '/',          label: 'ホーム',   icon: Home },
  { href: '/study',     label: '学習',     icon: BookOpen },
  { href: '/review',    label: '復習',     icon: BarChart2 },
  { href: '/mock',      label: '模試',     icon: Trophy },
  { href: '/news',      label: 'ニュース', icon: Newspaper },
];

export default function NavBar() {
  const pathname = usePathname();
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-gray-950 border-t border-gray-800">
      <div className="max-w-lg mx-auto flex">
        {NAV.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || (href !== '/' && pathname.startsWith(href));
          return (
            <Link key={href} href={href} className={cn(
              'flex-1 flex flex-col items-center py-2 text-xs gap-1 transition-colors',
              active ? 'text-blue-400' : 'text-gray-500 hover:text-gray-300'
            )}>
              <Icon size={20} />
              <span>{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
