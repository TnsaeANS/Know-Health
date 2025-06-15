
"use client";

import React, { useActionState, useEffect, useState } from 'react';
import { useFormStatus } from 'react-dom';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Loader2, AlertTriangle } from 'lucide-react';
import { submitReportAction, type ReportFormState } from '@/actions/report';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent } from '../ui/card';

interface ReportReviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  reviewId: string;
  reviewComment?: string;
}

const initialState: ReportFormState = {
  message: '',
  success: false,
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" variant="destructive" disabled={pending}>
      {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
      Submit Report
    </Button>
  );
}

export default function ReportReviewDialog({ open, onOpenChange, reviewId, reviewComment }: ReportReviewDialogProps) {
  const [state, formAction] = useActionState(submitReportAction, initialState);
  const { toast } = useToast();
  const { user } = useAuth();
  const [reason, setReason] = useState('');

  useEffect(() => {
    if (!open) {
        // Reset state when dialog closes
        setReason('');
        // A bit of a workaround to reset useActionState as it doesn't have a direct reset
        formAction(new FormData()); // Call with empty FormData to potentially reset if action handles it
    }
  }, [open, formAction]);


  useEffect(() => {
    if (state.message) {
      if (state.success) {
        toast({
          title: 'Report Submitted',
          description: state.message,
        });
        onOpenChange(false); // Close dialog on success
        setReason(''); // Clear textarea
      } else {
        toast({
          title: state.issues ? 'Validation Error' : 'Error Submitting Report',
          description: state.issues ? state.issues.join('\n') : state.message,
          variant: 'destructive',
        });
      }
    }
  }, [state, toast, onOpenChange]);

  if (!user) {
    // Optionally handle case where user is not logged in, e.g., disable reporting or show login prompt
    // For now, if the dialog is opened by a non-logged-in user (which shouldn't happen if report button is hidden/disabled),
    // it will simply not submit the userId. The server action should ideally validate this.
  }
  
  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    formData.set('reason', reason); // Ensure reason from state is used
    formAction(formData);
  };


  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <AlertTriangle className="mr-2 h-5 w-5 text-destructive" />
            Report Review
          </DialogTitle>
          <DialogDescription>
            You are reporting the following review content. Please provide a reason for your report.
            Your report will be reviewed by our moderation team.
          </DialogDescription>
        </DialogHeader>
        
        {reviewComment && (
          <Card className="my-4 bg-muted/50">
            <CardContent className="p-3 text-sm text-muted-foreground italic">
              <p className="line-clamp-3">&quot;{reviewComment}&quot;</p>
            </CardContent>
          </Card>
        )}
        {!reviewComment && (
            <p className="my-4 text-sm text-muted-foreground italic">
                You are reporting a review that consists of ratings without a written comment.
            </p>
        )}

        <form onSubmit={handleFormSubmit} className="space-y-4">
          <input type="hidden" name="reviewId" value={reviewId} />
          {user && <input type="hidden" name="userId" value={user.id} />}
          
          <div className="space-y-1.5">
            <Label htmlFor="reason">Reason for reporting</Label>
            <Textarea
              id="reason"
              name="reason"
              placeholder="Please describe why you are reporting this review (e.g., inappropriate content, spam, harassment)..."
              rows={4}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              required
              className={state.issues?.find(issue => issue.startsWith('reason:')) ? 'border-destructive' : ''}
            />
            {state.issues?.find(issue => issue.startsWith('reason:')) && (
              <p className="text-sm text-destructive">{state.issues.find(issue => issue.startsWith('reason:'))?.replace('reason: ', '')}</p>
            )}
          </div>
          
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </DialogClose>
            <SubmitButton />
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
