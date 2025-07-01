
"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { PageWrapper } from '@/components/ui/PageWrapper';
import { PageHeader } from '@/components/shared/PageHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Loader2, ShieldAlert, Inbox } from 'lucide-react';
import { format } from 'date-fns';
import { getMessages } from '@/actions/messages';
import type { ContactMessage } from '@/lib/types';

export default function MessagesPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [isLoadingMessages, setIsLoadingMessages] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login?redirect=/admin/messages');
    } else if (user) {
      setIsLoadingMessages(true);
      getMessages()
        .then(setMessages)
        .catch(console.error)
        .finally(() => setIsLoadingMessages(false));
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
          {isLoadingMessages ? (
            <div className="flex justify-center items-center h-48">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : messages.length > 0 ? (
            <div className="border rounded-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[80px]">Status</TableHead>
                    <TableHead className="w-[200px]">From</TableHead>
                    <TableHead>Subject</TableHead>
                    <TableHead className="hidden md:table-cell w-[180px]">Received</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {messages.map((message) => (
                    <TableRow key={message.id}>
                      <TableCell>
                        <Badge variant={message.is_read ? 'secondary' : 'default'}>
                          {message.is_read ? 'Read' : 'New'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{message.name}</div>
                        <div className="text-xs text-muted-foreground">{message.email}</div>
                      </TableCell>
                      <TableCell>
                        <p className="font-medium truncate max-w-xs">{message.subject}</p>
                        <p className="text-sm text-muted-foreground truncate max-w-xs">{message.message}</p>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {format(new Date(message.created_at), "PPP p")}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
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
