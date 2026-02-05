import type { Metadata } from 'next';
import './globals.css';
import { ClientProviders } from './providers';

export const metadata: Metadata = {
  title: 'CyberShield - AI-Powered Cybersecurity Training',
  description: 'Interactive cybersecurity awareness training powered by AI. Learn to identify threats, respond to incidents, and protect your organization.',
  keywords: ['cybersecurity', 'training', 'phishing', 'security awareness', 'AI training'],
  authors: [{ name: 'Michael Palmer' }],
  openGraph: {
    title: 'CyberShield - AI-Powered Cybersecurity Training',
    description: 'Interactive, AI-driven training that transforms your employees into your strongest line of defense against phishing, social engineering, and cyber attacks.',
    url: 'https://cyber-shield-mu.vercel.app',
    siteName: 'CyberShield',
    type: 'website',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=1200&h=630&fit=crop',
        width: 1200,
        height: 630,
        alt: 'CyberShield - AI-Powered Cybersecurity Training Platform',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CyberShield - AI-Powered Cybersecurity Training',
    description: 'Interactive, AI-driven training platform with adaptive difficulty engine and vulnerability profiling.',
    images: ['https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=1200&h=630&fit=crop'],
  },
  metadataBase: new URL('https://cyber-shield-mu.vercel.app'),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen antialiased">
        <ClientProviders>
          {children}
        </ClientProviders>
      </body>
    </html>
  );
}
