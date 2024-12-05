import { Toaster } from 'react-hot-toast';
import { Noto_Sans_KR } from 'next/font/google';
import 'swiper/css';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { metadataConfig, viewportConfig } from '@/constants/layout';
import { Providers } from '@/contexts';
import { StrictPropsWithChildren } from '@/types/common';
import './globals.css';

const noto_sans_kr = Noto_Sans_KR({
  subsets: ['latin'],
  variable: '--font-sans',
});

export const metadata = metadataConfig;
export const viewport = viewportConfig;

const RootLayout = ({ children }: StrictPropsWithChildren) => {
  return (
    <html suppressHydrationWarning lang="ko">
      <body className={`${noto_sans_kr.className} flex min-h-screen flex-col bg-background text-primary`}>
        <Providers>
          <ErrorBoundary>{children}</ErrorBoundary>
        </Providers>
        <Toaster position="top-right" />
      </body>
    </html>
  );
};

export default RootLayout;
