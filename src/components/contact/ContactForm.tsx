"use client";

import { useFormState, useFormStatus } from 'react-dom';
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { submitContactForm, type ContactFormState } from '@/actions/contact';
import { Loader2 } from 'lucide-react';

const initialState: ContactFormState = {
  message: '',
  success: false,
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground" disabled={pending}>
      {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
      Send Message
    </Button>
  );
}

export function ContactForm() {
  const [state, formAction] = useFormState(submitContactForm, initialState);
  const { toast } = useToast();

  useEffect(() => {
    if (state.message) {
      if (state.success) {
        toast({
          title: 'Message Sent!',
          description: state.message,
        });
        // Optionally reset form here if refs were used, or manage state to clear inputs
      } else if (state.issues) {
         toast({
          title: 'Validation Error',
          description: state.issues.join('\n'), // Or format better
          variant: 'destructive',
        });
      } else {
         toast({
          title: 'Error',
          description: state.message,
          variant: 'destructive',
        });
      }
    }
  }, [state, toast]);
  

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="font-headline text-xl">Send Us a Message</CardTitle>
        <CardDescription>We'd love to hear from you. Fill out the form below.</CardDescription>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" name="name" placeholder="Your Name" required />
              {state.issues && state.fields?.name && state.issues.find(issue => issue.toLowerCase().includes('name')) && (
                 <p className="text-sm text-destructive">{state.issues.find(issue => issue.toLowerCase().includes('name'))}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input id="email" name="email" type="email" placeholder="you@example.com" required />
               {state.issues && state.fields?.email && state.issues.find(issue => issue.toLowerCase().includes('email')) && (
                 <p className="text-sm text-destructive">{state.issues.find(issue => issue.toLowerCase().includes('email'))}</p>
              )}
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="subject">Subject</Label>
            <Input id="subject" name="subject" placeholder="Inquiry about..." required />
            {state.issues && state.fields?.subject && state.issues.find(issue => issue.toLowerCase().includes('subject')) && (
                 <p className="text-sm text-destructive">{state.issues.find(issue => issue.toLowerCase().includes('subject'))}</p>
              )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="message">Message</Label>
            <Textarea id="message" name="message" placeholder="Your message here..." rows={5} required />
             {state.issues && state.fields?.message && state.issues.find(issue => issue.toLowerCase().includes('message')) && (
                 <p className="text-sm text-destructive">{state.issues.find(issue => issue.toLowerCase().includes('message'))}</p>
              )}
          </div>
          <SubmitButton />
        </form>
      </CardContent>
    </Card>
  );
}
