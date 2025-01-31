import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { signOut } from 'next-auth/react';

interface HeaderProps {
  user?: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
}

export function Header({ user }: HeaderProps) {
  return (
    <header className="border-b">
      <div className="container flex h-16 items-center justify-between">
        <h1 className="text-xl font-bold">RememberMe</h1>
        <div className="flex items-center gap-4">
          <Avatar>
            <AvatarImage src={user?.image ?? undefined} />
          </Avatar>
          <Button 
            variant="ghost"
            onClick={() => signOut()}
          >
            Sign Out
          </Button>
        </div>
      </div>
    </header>
  );
} 