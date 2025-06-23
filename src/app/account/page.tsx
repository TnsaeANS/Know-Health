
"use client";

import Link from 'next/link';
import { PageWrapper } from '@/components/ui/PageWrapper';
import { PageHeader } from '@/components/shared/PageHeader';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Loader2, Edit3, ShieldAlert } from 'lucide-react';
import { mockReviews } from '@/lib/mockData'; // For "My Reviews"
import { ReviewCard } from '@/components/reviews/ReviewCard';


export default function AccountPage() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login?redirect=/account');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <PageWrapper className="flex items-center justify-center min-h-[calc(100vh-theme(spacing.32))]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </PageWrapper>
    );
  }

  if (!user) {
    // This case should ideally be handled by the redirect, but as a fallback:
    return (
      <PageWrapper className="flex flex-col items-center justify-center min-h-[calc(100vh-theme(spacing.32))] text-center">
        <ShieldAlert className="h-16 w-16 text-destructive mb-4" />
        <h2 className="text-2xl font-semibold mb-2">Access Denied</h2>
        <p className="text-muted-foreground mb-4">You need to be logged in to view this page.</p>
        <Button asChild><Link href="/login?redirect=/account">Login</Link></Button>
      </PageWrapper>
    );
  }
  
  // Mock: Filter reviews by current user's ID
  const userReviews = mockReviews.filter(review => review.userId === user.id);


  return (
    <PageWrapper>
      <PageHeader title="My Account" description="Manage your profile and view your activity." />
      
      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-1">
          <Card className="shadow-lg">
            <CardHeader className="items-center text-center">
               <Avatar className="h-24 w-24 mb-4 ring-2 ring-primary ring-offset-2 ring-offset-background">
                <AvatarImage src={user.avatarUrl} alt={user.name} data-ai-hint="user profile"/>
                <AvatarFallback className="text-3xl">{user.name?.substring(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <CardTitle className="font-headline text-2xl">{user.name}</CardTitle>
              <CardDescription>{user.email}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full">
                <Edit3 className="mr-2 h-4 w-4" /> Edit Profile
              </Button>
               <Button variant="destructive" className="w-full" onClick={() => { logout(); router.push('/'); }}>
                Logout
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-2">
           <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="font-headline text-xl">My Reviews</CardTitle>
              <CardDescription>Reviews you have submitted.</CardDescription>
            </CardHeader>
            <CardContent>
              {userReviews.length > 0 ? (
                <div className="space-y-4">
                  {userReviews.map(review => <ReviewCard key={review.id} review={review} />)}
                </div>
              ) : (
                <p className="text-muted-foreground">You haven't submitted any reviews yet.</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </PageWrapper>
  );
}

// Removed the custom Link component definition that was here.
// The <Link> usages above will now use the imported `next/link` component.
