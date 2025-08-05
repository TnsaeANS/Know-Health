
"use client";

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Loader2, Edit3, ShieldAlert, Stethoscope, Hospital, Edit, Trash2 } from 'lucide-react';
import { ReviewCard } from '@/components/reviews/ReviewCard';
import type { Review, Provider, Facility } from '@/lib/types';
import { getReviewsByUserId } from '@/actions/users';
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


interface AccountClientPageProps {
    initialReviews: Review[];
    initialProviders: Provider[];
    initialFacilities: Facility[];
}

function ContributionCard<T extends { id: string; name: string }>({
  item,
  itemType,
  onDelete,
}: {
  item: T;
  itemType: 'provider' | 'facility';
  onDelete: (id: string, name: string) => void;
}) {
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
            <Button variant="ghost" size="icon" className="h-8 w-8 hover:text-destructive">
                <Trash2 className="h-4 w-4" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
              <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete the {itemType} &quot;{item.name}&quot; and all associated reviews.
              </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={() => onDelete(item.id, item.name)}>
                  Continue
              </AlertDialogAction>
              </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}


export default function AccountClientPage({ initialReviews, initialProviders, initialFacilities }: AccountClientPageProps) {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const [userReviews, setUserReviews] = useState<Review[]>(initialReviews);
  const [userProviders, setUserProviders] = useState<Provider[]>(initialProviders);
  const [userFacilities, setUserFacilities] = useState<Facility[]>(initialFacilities);

  const [isFetchingReviews, setIsFetchingReviews] = useState(false);

  const fetchUserReviews = useCallback(async () => {
    if (user) {
        setIsFetchingReviews(true);
        const reviews = await getReviewsByUserId(user.id);
        setUserReviews(reviews);
        setIsFetchingReviews(false);
    }
  }, [user]);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login?redirect=/account');
    }
  }, [user, loading, router]);
  
  useEffect(() => {
    setUserReviews(initialReviews);
    setUserProviders(initialProviders);
    setUserFacilities(initialFacilities);
  }, [initialReviews, initialProviders, initialFacilities]);


  const handleReviewDeleted = useCallback((reviewId: string) => {
    setUserReviews(prev => prev.filter(r => r.id !== reviewId));
  }, []);

  const handleReviewUpdated = useCallback((updatedReview: Review) => {
    setUserReviews(prev => prev.map(r => r.id === updatedReview.id ? updatedReview : r));
  }, []);

  const handleDeleteProvider = async (id: string, name: string) => {
    if (!user) return;
    const result = await deleteProviderAction(id, user.id);
    if (result.success) {
      toast({ title: 'Provider Deleted', description: `Successfully deleted ${name}.` });
      setUserProviders(prev => prev.filter(p => p.id !== id));
    } else {
      toast({ title: 'Error', description: result.message, variant: 'destructive' });
    }
  };

  const handleDeleteFacility = async (id: string, name: string) => {
    if (!user) return;
    const result = await deleteFacilityAction(id, user.id);
    if (result.success) {
      toast({ title: 'Facility Deleted', description: `Successfully deleted ${name}.` });
      setUserFacilities(prev => prev.filter(f => f.id !== id));
    } else {
      toast({ title: 'Error', description: result.message, variant: 'destructive' });
    }
  };


  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-theme(spacing.32))]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-theme(spacing.32))] text-center">
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
              <CardTitle className="font-headline text-xl">My Reviews</CardTitle>
              <CardDescription>Reviews you have submitted.</CardDescription>
            </CardHeader>
            <CardContent>
              {isFetchingReviews ? (
                <div className="flex justify-center items-center h-48">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
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
                <p className="text-muted-foreground">You haven&apos;t submitted any reviews yet.</p>
              )}
            </CardContent>
          </Card>

          <Card className="shadow-lg">
              <CardHeader>
                  <CardTitle className="font-headline text-xl flex items-center"><Stethoscope className="mr-2 h-5 w-5" /> My Submitted Doctors</CardTitle>
                  <CardDescription>Doctors you have added to the platform.</CardDescription>
              </CardHeader>
              <CardContent>
                {userProviders.length > 0 ? (
                  <div className="space-y-2">
                    {userProviders.map(p => (
                      <ContributionCard key={p.id} item={p} itemType="provider" onDelete={handleDeleteProvider} />
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">You haven&apos;t added any doctors yet.</p>
                )}
              </CardContent>
          </Card>
          
          <Card className="shadow-lg">
              <CardHeader>
                  <CardTitle className="font-headline text-xl flex items-center"><Hospital className="mr-2 h-5 w-5" /> My Submitted Facilities</CardTitle>
                  <CardDescription>Facilities you have added to the platform.</CardDescription>
              </CardHeader>
              <CardContent>
                {userFacilities.length > 0 ? (
                  <div className="space-y-2">
                    {userFacilities.map(f => (
                      <ContributionCard key={f.id} item={f} itemType="facility" onDelete={handleDeleteFacility} />
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
