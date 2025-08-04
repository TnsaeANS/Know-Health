
"use client";

import { useEffect, useState, useTransition } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { PageWrapper } from '@/components/ui/PageWrapper';
import { PageHeader } from '@/components/shared/PageHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, ShieldAlert, Inbox, Check, Trash2, Quote, Users, MessageSquareWarning, Hospital, Star, Stethoscope, UserPlus } from 'lucide-react';
import { getReportedReviews, getMessageCounts as getDbMessageCounts, getTotalReviewsCount, getTotalFacilitiesCount, getTotalProvidersCount, getTotalUsersCount } from '@/lib/data';
import type { ReportedReview } from '@/lib/types';
import { ReviewCard } from '@/components/reviews/ReviewCard';
import { approveReviewAction, deleteReportedReviewAction, type ModerationResult } from '@/actions/report';
import { useToast } from '@/hooks/use-toast';

function ModerationCard({ review, onModerated }: { review: ReportedReview, onModerated: (reviewId: string) => void }) {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const handleApprove = () => {
    startTransition(async () => {
      const result: ModerationResult = await approveReviewAction(Number(review.id));
      toast({
        title: result.success ? "Success" : "Error",
        description: result.message,
        variant: result.success ? "default" : "destructive",
      });
      if (result.success) {
        onModerated(review.id);
      }
    });
  };
  
  const handleDelete = () => {
    startTransition(async () => {
      const result: ModerationResult = await deleteReportedReviewAction(Number(review.id));
      toast({
        title: result.success ? "Success" : "Error",
        description: result.message,
        variant: result.success ? "default" : "destructive",
      });
      if (result.success) {
        onModerated(review.id);
      }
    });
  };

  return (
    <Card className="bg-secondary/50">
      <CardHeader>
        <CardTitle>Review Details</CardTitle>
        <CardDescription>
            Reported by user <span className="font-mono text-xs">{review.reporterUserId}</span>
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="rounded-md border border-border bg-background p-4">
            <ReviewCard review={review} />
        </div>
        <div>
            <h4 className="font-semibold flex items-center"><Quote className="mr-2 h-4 w-4" />Report Reason:</h4>
            <p className="text-muted-foreground italic pl-6">&quot;{review.reportReason}&quot;</p>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end gap-2">
        <Button variant="destructive" onClick={handleDelete} disabled={isPending}>
          {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Trash2 className="mr-2 h-4 w-4" />}
          Delete Review
        </Button>
        <Button variant="default" onClick={handleApprove} disabled={isPending}>
          {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Check className="mr-2 h-4 w-4" />}
          Approve
        </Button>
      </CardFooter>
    </Card>
  )
}

function StatCard({ title, value, icon, action }: { title: string, value: string | number, icon: React.ReactNode, action?: React.ReactNode }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
      </CardContent>
      {action && <CardFooter>{action}</CardFooter>}
    </Card>
  )
}


export default function AdminDashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [reportedReviews, setReportedReviews] = useState<ReportedReview[]>([]);
  const [stats, setStats] = useState({
      unreadMessages: 0,
      totalReviews: 0,
      totalFacilities: 0,
      totalProviders: 0,
      totalUsers: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  const isAuthorized = !loading && user?.email === 'hellos@gmail.com';

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login?redirect=/admin/dashboard');
    } else if (user && user.email !== 'hellos@gmail.com') {
      router.push('/'); // Redirect non-admins to homepage
    } else if (isAuthorized) {
      setIsLoading(true);
      Promise.all([
        getReportedReviews(),
        getDbMessageCounts(),
        getTotalReviewsCount(),
        getTotalFacilitiesCount(),
        getTotalProvidersCount(),
        getTotalUsersCount(),
      ]).then(([reviews, msgCounts, reviewsCount, facilitiesCount, providersCount, usersCount]) => {
        setReportedReviews(reviews);
        setStats({
            unreadMessages: msgCounts.unread,
            totalReviews: reviewsCount,
            totalFacilities: facilitiesCount,
            totalProviders: providersCount,
            totalUsers: usersCount,
        });
      }).catch(console.error)
       .finally(() => setIsLoading(false));
    }
  }, [user, loading, router, isAuthorized]);
  
  const handleModeration = (reviewId: string) => {
    setReportedReviews(prev => prev.filter(r => r.id !== reviewId));
  };


  if (loading || (!isAuthorized && !user)) {
    return (
      <PageWrapper className="flex items-center justify-center min-h-[calc(100vh-theme(spacing.32))]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </PageWrapper>
    );
  }

  if (!isAuthorized) {
    return (
      <PageWrapper className="flex flex-col items-center justify-center min-h-[calc(100vh-theme(spacing.32))] text-center">
        <ShieldAlert className="h-16 w-16 text-destructive mb-4" />
        <h2 className="text-2xl font-semibold mb-2">Access Denied</h2>
        <p className="text-muted-foreground mb-4">You do not have permission to view this page.</p>
        <Button asChild><Link href="/">Go to Homepage</Link></Button>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <PageHeader title="Admin Dashboard" description="Oversee and moderate platform activity." />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 mb-8">
        <StatCard 
            title="Reviews for Moderation" 
            value={reportedReviews.length} 
            icon={<MessageSquareWarning className="h-4 w-4 text-muted-foreground" />} 
        />
        <StatCard 
            title="Unread Messages" 
            value={stats.unreadMessages} 
            icon={<Inbox className="h-4 w-4 text-muted-foreground" />}
            action={<Button asChild size="sm" variant="link" className="p-0 h-auto"><Link href="/admin/messages">View Messages</Link></Button>}
        />
        <StatCard 
            title="Total Users" 
            value={stats.totalUsers} 
            icon={<UserPlus className="h-4 w-4 text-muted-foreground" />} 
        />
        <StatCard 
            title="Total Reviews" 
            value={stats.totalReviews} 
            icon={<Star className="h-4 w-4 text-muted-foreground" />} 
        />
        <StatCard 
            title="Total Providers" 
            value={stats.totalProviders} 
            icon={<Stethoscope className="h-4 w-4 text-muted-foreground" />} 
        />
        <StatCard 
            title="Total Facilities" 
            value={stats.totalFacilities} 
            icon={<Hospital className="h-4 w-4 text-muted-foreground" />} 
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Review Moderation Queue</CardTitle>
          <CardDescription>
            {reportedReviews.length > 0 ? `${reportedReviews.length} review(s) awaiting moderation.` : "The queue is empty."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center h-48">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : reportedReviews.length > 0 ? (
            <div className="space-y-6">
              {reportedReviews.map((review) => (
                <ModerationCard key={review.id} review={review} onModerated={handleModeration} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <Inbox className="mx-auto h-12 w-12 mb-4" />
              <p>The moderation queue is empty. Great job!</p>
            </div>
          )}
        </CardContent>
      </Card>
    </PageWrapper>
  );
}
