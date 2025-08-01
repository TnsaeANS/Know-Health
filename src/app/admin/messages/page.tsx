
"use client";

import { useEffect, useState, useTransition } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { PageWrapper } from '@/components/ui/PageWrapper';
import { PageHeader } from '@/components/shared/PageHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Loader2, ShieldAlert, Inbox, CheckCircle2 } from 'lucide-react';
import { format } from 'date-fns';
import { getMessages, markMessageAsRead } from '@/actions/messages';
import type { ContactMessage } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"


export default function MessagesPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [isLoadingMessages, setIsLoadingMessages] = useState(true);
  const [isPending, startTransition] = useTransition();

  const fetchMessages = () => {
      setIsLoadingMessages(true);
      getMessages()
        .then(setMessages)
        .catch(console.error)
        .finally(() => setIsLoadingMessages(false));
  }

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login?redirect=/admin/messages');
    } else if (user) {
      fetchMessages();
    }
  }, [user, loading, router]);
  
  const handleMarkAsRead = (message: ContactMessage) => {
    if (message.is_read) return;

    startTransition(async () => {
        const result = await markMessageAsRead(message.id);
        if (result.success) {
            toast({
                title: "Message updated",
                description: "Marked as read."
            });
            // Optimistically update UI
            setMessages(prev => prev.map(m => m.id === message.id ? {...m, is_read: true} : m));
        } else {
            toast({
                title: "Error",
                description: "Could not mark message as read.",
                variant: "destructive"
            });
        }
    });
  };

  if (loading || isLoadingMessages) {
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
        <Button asChild><Link href="/login?redirect=/admin/messages">Login</Link></Button>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <PageHeader title="Contact Messages" description="Review messages submitted through the contact form." />

      <Card>
        <CardHeader>
          <CardTitle>Inbox</CardTitle>
          <CardDescription>
            {messages.length} message(s) received.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {messages.length > 0 ? (
            <div className="border rounded-md">
                <Accordion type="single" collapsible className="w-full">
                    {messages.map(message => (
                        <AccordionItem value={`item-${message.id}`} key={message.id}>
                            <AccordionTrigger 
                                className={`px-4 py-2 hover:no-underline hover:bg-muted/50 ${!message.is_read ? 'font-bold' : ''}`}
                                onClick={() => handleMarkAsRead(message)}
                            >
                                <div className="flex-1 grid grid-cols-12 gap-4 items-center text-left">
                                    <div className="col-span-1">
                                        <Badge variant={message.is_read ? 'secondary' : 'default'}>
                                        {message.is_read ? 'Read' : 'New'}
                                        </Badge>
                                    </div>
                                    <div className="col-span-3">
                                        <div className="truncate">{message.name}</div>
                                        <div className="text-xs text-muted-foreground truncate">{message.email}</div>
                                    </div>
                                    <div className="col-span-5 truncate">{message.subject}</div>
                                    <div className="col-span-3 hidden md:block text-sm text-muted-foreground text-right pr-4">
                                        {format(new Date(message.created_at), "PPP p")}
                                    </div>
                                </div>
                            </AccordionTrigger>
                            <AccordionContent className="p-4 bg-secondary/30">
                                <p className="whitespace-pre-wrap">{message.message}</p>
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <Inbox className="mx-auto h-12 w-12 mb-4" />
              <p>Your inbox is empty.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </PageWrapper>
  );
}
