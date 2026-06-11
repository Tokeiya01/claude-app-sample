import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import NavBar from '@/components/NavBar';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'KeizaiSense | 日経TEST対策',
  description: '日経TESTの問題演習・FSRS復習・弱点分析・模試・ニュース問題生成を一体で提供する学習アプリ',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja" className="dark">
      <body className={`${inter.className} bg-gray-950 text-gray-100 min-h-screen`}>
        <div className="max-w-lg mx-auto pb-20">
          {children}
        </div>
        <NavBar />
      </body>
    </html>
  );
}
