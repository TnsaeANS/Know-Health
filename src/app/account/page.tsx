
"use client";

import Link from 'next/link';
import { PageWrapper } from '@/components/ui/PageWrapper';
import { PageHeader } from '@/components/shared/PageHeader';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Loader2, Edit3, ShieldAlert } from 'lucide-react';
import { ReviewCard } from '@/components/reviews/ReviewCard';
import type { Review } from '@/lib/types';
import { getReviewsByUserId } from '@/actions/users';


export default function AccountPage() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const [userReviews, setUserReviews] = useState<Review[]>([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login?redirect=/account');
    } else if (user) {
      setReviewsLoading(true);
      getReviewsByUserId(user.id)
        .then(reviews => {
          setUserReviews(reviews);
        })
        .catch(console.error)
        .finally(() => {
          setReviewsLoading(false);
        });
    }
  }, [user, loading, router]);
  
  const handleReviewDeleted = useCallback((reviewId: string) => {
    setUserReviews(prev => prev.filter(r => r.id !== reviewId));
  }, []);

  const handleReviewUpdated = useCallback((updatedReview: Review) => {
    setUserReviews(prev => prev.map(r => r.id === updatedReview.id ? updatedReview : r));
  }, []);

  if (loading) {
    return (
      <PageWrapper className="flex items-center justify-center min-h-[calc(100vh-theme(spacing.32))]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </PageWrapper>
    );
  }

  if (!user) {
    return (
      <PageWrapper className="flex flex-col items-center justify-center min-h-[calc(100vh-theme(spacing.32))] text-center">
        <ShieldAlert className="h-16 w-16 text-destructive mb-4" />
        <h2 className="text-2xl font-semibold mb-2">Access Denied</h2>
        <p className="text-muted-foreground mb-4">You need to be logged in to view this page.</p>
        <Button asChild><Link href="/login?redirect=/account">Login</Link></Button>
      </PageWrapper>
    );
  }
  
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
              {reviewsLoading ? (
                 <div className="flex justify-center items-center h-24">
                   <Loader2 className="h-6 w-6 animate-spin text-primary" />
                 </div>
              ) : userReviews.length > 0 ? (
                <div className="space-y-4">
                  {userReviews.map(review => 
                    <ReviewCard 
                      key={review.id} 
                      review={review}
                      onReviewDeleted={handleReviewDeleted}
                      onReviewUpdated={handleReviewUpdated}
                    />)}
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
