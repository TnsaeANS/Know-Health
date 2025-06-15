"use client";

import Link from 'next/link';
import { NAV_LINKS } from '@/lib/constants';
import Logo from './Logo';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, UserCircle } from 'lucide-react';
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

const NavItem = ({ item }: { item: NavItemType }) => (
  <Link href={item.href} passHref>
    <Button variant="ghost" className="text-foreground hover:bg-primary/10 hover:text-primary transition-colors px-3 py-2 rounded-md text-sm font-medium">
      {item.icon && <item.icon className="mr-2 h-5 w-5" />}
      {item.label}
    </Button>
  </Link>
);

export function Navbar() {
  const { user, logout } = useAuth();

  const UserMenu = () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
          <Avatar className="h-9 w-9">
            <AvatarImage src={user?.avatarUrl || "https://placehold.co/40x40.png"} alt={user?.name} data-ai-hint="user avatar" />
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
              <div className="flex flex-col space-y-4 p-4">
                <Logo />
                {NAV_LINKS.map((item) => (
                  <Link key={item.label} href={item.href} passHref>
                    <Button variant="ghost" className="w-full justify-start text-lg">
                      {item.icon && <item.icon className="mr-3 h-6 w-6" />}
                      {item.label}
                    </Button>
                  </Link>
                ))}
                <hr className="my-4" />
                {user ? (
                  <div className="space-y-2">
                     <Button variant="outline" className="w-full" asChild>
                        <Link href="/account">My Account</Link>
                      </Button>
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
