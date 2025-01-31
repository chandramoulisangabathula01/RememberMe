import { Inter } from 'next/font/google';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
// import { authOptions } from '@/lib/auth';
import { Header } from '@/components/layout/header';
import { cn } from '@/lib/utils';
import './globals.css';
import { authOptions } from '@/lib/auth';

const inter = Inter({ subsets: ['latin'] });

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    redirect('/login');
  }

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn(
        'min-h-screen bg-background antialiased',
        inter.className
      )}>
        <Header user={session.user as { name?: string; image?: string }} />
        <main className="container pt-8 pb-24">
          {children}
        </main>
      </body>
    </html>
  );
}
