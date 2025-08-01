
"use client";

import Link from 'next/link';
import { NAV_LINKS } from '@/lib/constants';
import Logo from './Logo';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Menu, UserCircle, Inbox, ShieldCheck } from 'lucide-react';
import type { NavItem as NavItemType } from '@/lib/types';
import { useAuth } from '@/context/AuthContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useEffect, useState } from 'react';
import { getMessageCounts } from '@/actions/messages';
import { Skeleton } from '@/components/ui/skeleton';

const NavItem = ({ item }: { item: NavItemType }) => (
  <Button asChild variant="ghost" className="text-foreground hover:bg-primary/10 hover:text-primary transition-colors px-3 py-2 rounded-md text-sm font-medium">
    <Link href={item.href}>
      {item.icon && <item.icon className="mr-2 h-5 w-5" />}
      {item.label}
    </Link>
  </Button>
);

export function Navbar() {
  const { user, logout, loading } = useAuth();
  const [unreadMessages, setUnreadMessages] = useState(0);

  const isAdmin = user?.email === 'hellos@gmail.com';

  useEffect(() => {
    if (isAdmin) {
      const interval = setInterval(() => {
        getMessageCounts().then(counts => setUnreadMessages(counts.unread));
      }, 30000); // Poll every 30 seconds

      // Initial fetch
      getMessageCounts().then(counts => setUnreadMessages(counts.unread));

      return () => clearInterval(interval);
    }
  }, [isAdmin]);

  const UserMenu = () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
          <Avatar className="h-9 w-9">
            <AvatarImage src={user?.avatarUrl || "https://placehold.co/40x40.png"} alt={user?.name || ''} data-ai-hint="user avatar" />
            <AvatarFallback>{user?.name?.substring(0,2).toUpperCase() || 'U'}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user?.name}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {user?.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/account">
            <UserCircle className="mr-2 h-4 w-4" />
            <span>My Account</span>
          </Link>
        </DropdownMenuItem>
        {isAdmin && (
          <>
            <DropdownMenuItem asChild>
              <Link href="/admin/dashboard">
                <ShieldCheck className="mr-2 h-4 w-4" />
                <span>Admin Dashboard</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/admin/messages" className="relative">
                <Inbox className="mr-2 h-4 w-4" />
                <span>View Messages</span>
                {unreadMessages > 0 && (
                  <span className="absolute right-2 top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-xs text-destructive-foreground">
                    {unreadMessages}
                  </span>
                )}
              </Link>
            </DropdownMenuItem>
          </>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={logout}>
          {/* <LogOut className="mr-2 h-4 w-4" /> */}
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );


  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Logo />
        <nav className="hidden md:flex items-center space-x-2">
          {NAV_LINKS.map((item) => (
            <NavItem key={item.label} item={item} />
          ))}
        </nav>
        <div className="hidden md:flex items-center space-x-2">
          {user ? (
            <UserMenu />
          ) : (
            <>
              <Button variant="ghost" asChild>
                <Link href="/login">Login</Link>
              </Button>
              <Button asChild className="bg-primary hover:bg-primary/90 text-primary-foreground">
                <Link href="/signup">Sign Up</Link>
              </Button>
            </>
          )}
        </div>
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <SheetHeader>
                <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
              </SheetHeader>
              <div className="flex flex-col space-y-4 p-4">
                <Logo />
                {NAV_LINKS.map((item) => (
                  <Button key={item.label} variant="ghost" className="w-full justify-start text-lg" asChild>
                    <Link href={item.href}>
                      {item.icon && <item.icon className="mr-3 h-6 w-6" />}
                      {item.label}
                    </Link>
                  </Button>
                ))}
                <hr className="my-4" />
                {loading ? (
                   <div className="space-y-2">
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-10 w-full" />
                    </div>
                ) : user ? (
                  <div className="space-y-2">
                     <Button variant="outline" className="w-full" asChild>
                        <Link href="/account">My Account</Link>
                      </Button>
                     {isAdmin && (
                        <>
                            <Button variant="outline" className="w-full" asChild>
                                <Link href="/admin/dashboard">Admin Dashboard</Link>
                            </Button>
                            <Button variant="outline" className="w-full" asChild>
                                <Link href="/admin/messages" className="relative">
                                View Messages
                                {unreadMessages > 0 && (
                                    <span className="absolute right-4 top-1/2 -translate-y-1/2 flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-xs text-destructive-foreground">
                                        {unreadMessages}
                                    </span>
                                    )}
                                </Link>
                            </Button>
                        </>
                     )}
                    <Button variant="destructive" className="w-full" onClick={logout}>
                      Logout
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Button variant="outline" className="w-full" asChild>
                      <Link href="/login">Login</Link>
                    </Button>
                    <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground" asChild>
                      <Link href="/signup">Sign Up</Link>
                    </Button>
                  </div>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
