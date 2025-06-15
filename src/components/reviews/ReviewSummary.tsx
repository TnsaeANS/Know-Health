import type { ReviewSummaryAI } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ThumbsUp, ThumbsDown, MessageCircle } from 'lucide-react';

interface ReviewSummaryProps {
  summaryData: ReviewSummaryAI | null;
  isLoading?: boolean;
}

export function ReviewSummary({ summaryData, isLoading = false }: ReviewSummaryProps) {
  if (isLoading) {
    return (
      <Card className="mt-8 shadow-lg animate-pulse">
        <CardHeader>
          <CardTitle className="font-headline text-xl flex items-center">
            <MessageCircle className="h-6 w-6 mr-2 text-primary" />
            AI Review Summary
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="h-4 bg-muted rounded w-3/4"></div>
          <div className="h-4 bg-muted rounded w-1/2"></div>
          <div className="h-4 bg-muted rounded w-full"></div>
        </CardContent>
      </Card>
    )
  }
  
  if (!summaryData) {
    return (
       <Card className="mt-8 shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline text-xl flex items-center">
             <MessageCircle className="h-6 w-6 mr-2 text-primary" />
            AI Review Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Not enough reviews to generate a summary yet.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mt-8 shadow-lg bg-gradient-to-br from-primary/5 via-background to-accent/5">
      <CardHeader>
        <CardTitle className="font-headline text-xl flex items-center">
          <MessageCircle className="h-6 w-6 mr-2 text-primary" />
          AI Review Summary
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="font-semibold text-lg text-foreground mb-2">Overall Sentiment:</h3>
          <p className="text-muted-foreground leading-relaxed">{summaryData.summary}</p>
        </div>
        
        {summaryData.positiveThemes && (
          <div>
            <h3 className="font-semibold text-lg text-foreground mb-2 flex items-center">
              <ThumbsUp className="h-5 w-5 mr-2 text-green-500" />
              Common Positive Themes:
            </h3>
            <p className="text-muted-foreground leading-relaxed">{summaryData.positiveThemes}</p>
          </div>
        )}

        {summaryData.negativeThemes && (
          <div>
            <h3 className="font-semibold text-lg text-foreground mb-2 flex items-center">
              <ThumbsDown className="h-5 w-5 mr-2 text-red-500" />
              Common Negative Themes:
            </h3>
            <p className="text-muted-foreground leading-relaxed">{summaryData.negativeThemes}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
