import type { Metadata } from 'next';
import { Lora, Inter } from 'next/font/google';
import './globals.css';

const lora = Lora({
  variable: '--font-serif',
  subsets: ['cyrillic', 'latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
});

const inter = Inter({
  variable: '--font-sans',
  subsets: ['cyrillic', 'latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Кварта — мастерская свежей обжарки кофе в Минске',
  description:
    'Обжариваем спешелти кофе партиями по 5 кг каждый четверг. Доставка по Минску по пятницам. Свежий кофе на 1–3-й день без снобизма.',
  metadataBase: new URL('https://kvartacoffee.by'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Кварта — мастерская свежей обжарки кофе в Минске',
    description:
      'Обжарили в четверг — в пятницу уже пьёте. Партии по 5 кг, доставка свежего кофе по Минску.',
    url: 'https://kvartacoffee.by',
    siteName: 'Мастерская кофе «Кварта»',
    images: [
      {
        url: '/images/og_image.jpg',
        width: 1200,
        height: 630,
        alt: 'Мастерская кофе «Кварта» в Минске',
      },
    ],
    locale: 'ru_BY',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Кварта — мастерская свежей обжарки кофе в Минске',
    description:
      'Обжарили в четверг — в пятницу уже пьёте. Партии по 5 кг, доставка по Минску.',
    images: ['/images/og_image.jpg'],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru" className={`${lora.variable} ${inter.variable} scroll-smooth`}>
      <body className="min-h-screen bg-[#FBF9F5] text-[#1B1614] font-sans antialiased selection:bg-[#EBDDD0] selection:text-[#1B1614]">
        {children}
      </body>
    </html>
  );
}
