
"use client";

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useCallback, useTransition } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Loader2, Edit3, ShieldAlert, Stethoscope, Hospital, Edit, Trash2 } from 'lucide-react';
import { ReviewCard } from '@/components/reviews/ReviewCard';
import type { Review, Provider, Facility } from '@/lib/types';
import { getReviewsByUserId } from '@/actions/users';
import { getFacilitiesByUserId, getProvidersByUserId } from '@/lib/data';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useToast } from '@/hooks/use-toast';
import { deleteProviderAction } from '@/actions/providers';
import { deleteFacilityAction } from '@/actions/facilities';


interface ContributionCardProps<T extends { id: string; name: string }> {
  item: T;
  itemType: 'provider' | 'facility';
  onDelete: (id: string, name: string) => void;
  isPending: boolean;
}

function ContributionCard<T extends { id: string; name: string }>({
  item,
  itemType,
  onDelete,
  isPending,
}: ContributionCardProps<T>) {
  const href = `/${itemType === 'provider' ? 'providers' : 'facilities'}/${item.id}/edit`;
  
  return (
    <div className="flex items-center justify-between p-3 bg-secondary/50 rounded-md">
      <p className="font-medium text-sm text-secondary-foreground">{item.name}</p>
      <div className="flex items-center gap-1">
        <Button asChild variant="ghost" size="icon" className="h-8 w-8">
          <Link href={href}>
            <Edit className="h-4 w-4" />
          </Link>
        </Button>
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 hover:text-destructive" disabled={isPending}>
                    {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                </Button>
            </AlertDialogTrigger>
          <AlertDialogContent>
              <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete the {itemType} &quot;{item.name}&quot; and all associated data.
              </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={() => onDelete(item.id, item.name)} disabled={isPending}>
                  Continue
              </AlertDialogAction>
              </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}


export default function AccountClientPage() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const [isLoadingData, setIsLoadingData] = useState(true);
  const [userReviews, setUserReviews] = useState<Review[]>([]);
  const [userProviders, setUserProviders] = useState<Provider[]>([]);
  const [userFacilities, setUserFacilities] = useState<Facility[]>([]);
  const [isDeleting, startDeleteTransition] = useTransition();

  useEffect(() => {
    if (loading) return; // Wait until auth state is confirmed
    if (!user) {
      router.push('/login?redirect=/account');
      return;
    }

    // User is authenticated, now fetch their data
    setIsLoadingData(true);
    Promise.all([
      getReviewsByUserId(user.id),
      getProvidersByUserId(user.id),
      getFacilitiesByUserId(user.id)
    ]).then(([reviews, providers, facilities]) => {
      setUserReviews(reviews);
      setUserProviders(providers);
      setUserFacilities(facilities);
    }).catch(err => {
        console.error("Failed to fetch account data:", err);
        toast({ title: 'Error', description: 'Could not load your account data.', variant: 'destructive' });
    }).finally(() => {
        setIsLoadingData(false);
    });

  }, [user, loading, router, toast]);

  const handleReviewDeleted = useCallback((reviewId: string) => {
    setUserReviews(prev => prev.filter(r => r.id !== reviewId));
  }, []);

  const handleReviewUpdated = useCallback((updatedReview: Review) => {
    setUserReviews(prev => prev.map(r => r.id === updatedReview.id ? updatedReview : r));
  }, []);

  const handleDeleteProvider = (id: string, name: string) => {
    if (!user) return;
    startDeleteTransition(async () => {
      const result = await deleteProviderAction(id, user.id);
      if (result.success) {
        toast({ title: 'Provider Deleted', description: `Successfully deleted ${name}.` });
        setUserProviders(prev => prev.filter(p => p.id !== id));
      } else {
        toast({ title: 'Error', description: result.message, variant: 'destructive' });
      }
    });
  };

  const handleDeleteFacility = (id: string, name: string) => {
    if (!user) return;
    startDeleteTransition(async () => {
        const result = await deleteFacilityAction(id, user.id);
        if (result.success) {
        toast({ title: 'Facility Deleted', description: `Successfully deleted ${name}.` });
        setUserFacilities(prev => prev.filter(f => f.id !== id));
        } else {
        toast({ title: 'Error', description: result.message, variant: 'destructive' });
        }
    });
  };

  if (loading || isLoadingData) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-theme(spacing.48))]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    // This UI is a fallback for the redirect.
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-theme(spacing.48))] text-center">
        <ShieldAlert className="h-16 w-16 text-destructive mb-4" />
        <h2 className="text-2xl font-semibold mb-2">Access Denied</h2>
        <p className="text-muted-foreground mb-4">You need to be logged in to view this page.</p>
        <Button asChild><Link href="/login?redirect=/account">Login</Link></Button>
      </div>
    );
  }
  
  return (
    <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-1 space-y-8">
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

        <div className="md:col-span-2 space-y-8">
           <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="font-headline text-xl">My Reviews ({userReviews.length})</CardTitle>
              <CardDescription>Reviews you have submitted.</CardDescription>
            </CardHeader>
            <CardContent>
              {userReviews.length > 0 ? (
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
                <p className="text-muted-foreground">You haven&apos;t submitted any reviews yet.</p>
              )}
            </CardContent>
          </Card>

          <Card className="shadow-lg">
              <CardHeader>
                  <CardTitle className="font-headline text-xl flex items-center"><Stethoscope className="mr-2 h-5 w-5" /> My Submitted Doctors ({userProviders.length})</CardTitle>
                  <CardDescription>Doctors you have added to the platform.</CardDescription>
              </CardHeader>
              <CardContent>
                {userProviders.length > 0 ? (
                  <div className="space-y-2">
                    {userProviders.map(p => (
                      <ContributionCard key={p.id} item={p} itemType="provider" onDelete={handleDeleteProvider} isPending={isDeleting} />
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">You haven&apos;t added any doctors yet.</p>
                )}
              </CardContent>
          </Card>
          
          <Card className="shadow-lg">
              <CardHeader>
                  <CardTitle className="font-headline text-xl flex items-center"><Hospital className="mr-2 h-5 w-5" /> My Submitted Facilities ({userFacilities.length})</CardTitle>
                  <CardDescription>Facilities you have added to the platform.</CardDescription>
              </CardHeader>
              <CardContent>
                {userFacilities.length > 0 ? (
                  <div className="space-y-2">
                    {userFacilities.map(f => (
                      <ContributionCard key={f.id} item={f} itemType="facility" onDelete={handleDeleteFacility} isPending={isDeleting} />
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">You haven&apos;t added any facilities yet.</p>
                )}
              </CardContent>
          </Card>
        </div>
      </div>
  );
}
