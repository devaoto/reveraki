import type { Metadata } from 'next';
import { Exo } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';
import TopProgressBar from '../components/ProgressBar';
import NavComp from '@/components/Nav';
import Footer from '@/components/footer';
import { ScrollToTop } from '@/components/ScrollToTop';
import dynamic from 'next/dynamic';

const Changelogs = dynamic(() => import('@/components/Changelogs'), {
  ssr: false,
});

const ThemeProvider = dynamic(() => import('./ThemeProvider'), {
  ssr: false,
});

const exo = Exo({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Reveraki',
  description: 'An ad-free anime streaming website',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <body className={`${exo.className} flex min-h-screen flex-col`}>
        <Providers>
          <ThemeProvider>
            <NavComp />
            <main className="flex-grow">{children}</main>
            <Footer />
            <TopProgressBar />
            <ScrollToTop />
            <Changelogs />
          </ThemeProvider>
        </Providers>
      </body>
    </html>
  );
}

