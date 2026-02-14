import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { CheckCircle2, XCircle, Loader2, MessageSquare, Clock, User } from 'lucide-react';
import { useGetPendingTestimonials, useUpdateTestimonialStatus } from '../../hooks/useTestimonials';
import { TestimonialStatus } from '../../backend';
import { toast } from 'sonner';

export default function AdminTestimonialsModerationPanel() {
  const { data: pendingTestimonials, isLoading } = useGetPendingTestimonials();
  const updateStatus = useUpdateTestimonialStatus();
  
  // Track which testimonial is currently being processed
  const [processingId, setProcessingId] = useState<string | null>(null);

  const handleApprove = async (testimonialId: bigint) => {
    const idString = testimonialId.toString();
    setProcessingId(idString);
    
    try {
      await updateStatus.mutateAsync({
        testimonialId,
        newStatus: TestimonialStatus.approved,
      });
      toast.success('Testimonial approved successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to approve testimonial');
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (testimonialId: bigint) => {
    const idString = testimonialId.toString();
    setProcessingId(idString);
    
    try {
      await updateStatus.mutateAsync({
        testimonialId,
        newStatus: TestimonialStatus.rejected,
      });
      toast.success('Testimonial rejected');
    } catch (error: any) {
      toast.error(error.message || 'Failed to reject testimonial');
    } finally {
      setProcessingId(null);
    }
  };

  const formatTimestamp = (timestamp: bigint) => {
    const date = new Date(Number(timestamp) / 1000000); // Convert nanoseconds to milliseconds
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const parseTestimonialContent = (content: string) => {
    try {
      const parsed = JSON.parse(content);
      return {
        quote: parsed.quote || '',
        name: parsed.name || 'Unknown',
        role: parsed.role || 'Unknown',
      };
    } catch {
      return {
        quote: content,
        name: 'Unknown',
        role: 'Unknown',
      };
    }
  };

  const getStatusBadge = (status: TestimonialStatus) => {
    switch (status) {
      case TestimonialStatus.pending:
        return (
          <Badge variant="outline" className="gap-1">
            <Clock className="h-3 w-3" />
            Pending
          </Badge>
        );
      case TestimonialStatus.approved:
        return (
          <Badge variant="default" className="gap-1 bg-green-600">
            <CheckCircle2 className="h-3 w-3" />
            Approved
          </Badge>
        );
      case TestimonialStatus.rejected:
        return (
          <Badge variant="destructive" className="gap-1">
            <XCircle className="h-3 w-3" />
            Rejected
          </Badge>
        );
      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            <p className="text-sm text-muted-foreground">Loading pending testimonials...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!pendingTestimonials || pendingTestimonials.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Testimonial Moderation
          </CardTitle>
          <CardDescription>Review and approve user-submitted testimonials</CardDescription>
        </CardHeader>
        <CardContent>
          <Alert>
            <MessageSquare className="h-4 w-4" />
            <AlertDescription>
              No pending testimonials to review at this time.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          Testimonial Moderation
        </CardTitle>
        <CardDescription>
          Review and approve user-submitted testimonials ({pendingTestimonials.length} pending)
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {pendingTestimonials.map((testimonial) => {
          const { quote, name, role } = parseTestimonialContent(testimonial.content);
          const idString = testimonial.id.toString();
          const isThisRowProcessing = processingId === idString;

          return (
            <div key={idString} className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      {getStatusBadge(testimonial.status)}
                      <span className="text-xs text-muted-foreground">
                        {formatTimestamp(testimonial.timestamp)}
                      </span>
                    </div>
                    
                    <blockquote className="text-sm leading-relaxed border-l-4 border-primary/30 pl-4 py-2">
                      "{quote}"
                    </blockquote>

                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-1.5">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{name}</span>
                      </div>
                      <span className="text-muted-foreground">•</span>
                      <span className="text-muted-foreground">{role}</span>
                    </div>

                    <div className="text-xs text-muted-foreground font-mono">
                      Submitter: {testimonial.submitter.toString().slice(0, 20)}...
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="default"
                    onClick={() => handleApprove(testimonial.id)}
                    disabled={isThisRowProcessing}
                    className="gap-1.5"
                  >
                    {isThisRowProcessing ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <CheckCircle2 className="h-4 w-4" />
                    )}
                    Approve
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleReject(testimonial.id)}
                    disabled={isThisRowProcessing}
                    className="gap-1.5"
                  >
                    {isThisRowProcessing ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <XCircle className="h-4 w-4" />
                    )}
                    Reject
                  </Button>
                </div>
              </div>

              <Separator />
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
