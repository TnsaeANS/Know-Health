"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { PageWrapper } from '@/components/ui/PageWrapper';
import { SearchX } from 'lucide-react';

export default function NotFound() {
  return (
    <PageWrapper className="flex flex-col items-center justify-center min-h-[calc(100vh-theme(spacing.32))] text-center">
      <SearchX className="h-24 w-24 text-primary mb-8" />
      <h1 className="text-5xl font-headline font-bold text-foreground mb-4">404 - Page Not Found</h1>
      <p className="text-xl text-muted-foreground mb-8 max-w-md">
        Oops! The page you are looking for does not exist. It might have been moved or deleted.
      </p>
      <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
        <Link href="/">Go Back Home</Link>
      </Button>
    </PageWrapper>
  );
}
