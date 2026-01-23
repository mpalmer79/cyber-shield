import type { Metadata } from 'next';
import './globals.css';
import { ClientProviders } from './providers';

export const metadata: Metadata = {
  title: 'CyberShield - AI-Powered Cybersecurity Training',
  description: 'Interactive cybersecurity awareness training powered by AI. Learn to identify threats, respond to incidents, and protect your organization.',
  keywords: ['cybersecurity', 'training', 'phishing', 'security awareness', 'AI training'],
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
