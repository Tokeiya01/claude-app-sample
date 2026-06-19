import type { Metadata } from 'next';
import './globals.css';
import NavBar from '@/components/NavBar';

export const metadata: Metadata = {
  title: 'KeizaiSense | 日経TEST対策',
  description: '模試・日次演習・弱点克服で日経TESTをスコアアップ',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body className="bg-gray-50 text-gray-900 min-h-screen">
        <div className="max-w-lg mx-auto min-h-screen bg-white shadow-sm pb-24">
          {children}
        </div>
        <NavBar />
      </body>
    </html>
  );
}
