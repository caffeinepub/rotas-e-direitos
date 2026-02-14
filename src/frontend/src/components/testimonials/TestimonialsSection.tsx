import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Quote } from 'lucide-react';
import { testimonials as staticTestimonials } from './testimonialsData';
import { useGetApprovedTestimonials } from '../../hooks/useTestimonials';
import SubmitTestimonialDialog from './SubmitTestimonialDialog';

interface DisplayTestimonial {
  quote: string;
  name: string;
  role: string;
}

export default function TestimonialsSection() {
  const { data: approvedTestimonials, isLoading, isError } = useGetApprovedTestimonials();

  // Parse backend testimonials
  const backendTestimonials: DisplayTestimonial[] = (approvedTestimonials || [])
    .map((t) => {
      try {
        const parsed = JSON.parse(t.content);
        return {
          quote: parsed.quote || '',
          name: parsed.name || 'Anônimo',
          role: parsed.role || 'Entregador',
        };
      } catch {
        return null;
      }
    })
    .filter((t): t is DisplayTestimonial => t !== null);

  // Use backend testimonials if available, otherwise fall back to static
  const displayTestimonials =
    !isError && backendTestimonials.length > 0
      ? backendTestimonials
      : staticTestimonials;

  return (
    <section className="space-y-8">
      <div className="text-center space-y-3">
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
          O Que os Entregadores Estão Dizendo
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Histórias reais de parceiros de entrega que defenderam seus direitos com sucesso
        </p>
      </div>

      {isLoading ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i}>
              <CardContent className="pt-6 space-y-4">
                <Skeleton className="h-8 w-8" />
                <Skeleton className="h-20 w-full" />
                <div className="pt-2 border-t space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-3 w-32" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {displayTestimonials.map((testimonial, index) => (
            <Card key={index} className="relative">
              <CardContent className="pt-6 space-y-4">
                <Quote className="h-8 w-8 text-primary/30" aria-hidden="true" />
                <blockquote className="text-sm leading-relaxed">
                  "{testimonial.quote}"
                </blockquote>
                <div className="pt-2 border-t">
                  <p className="font-semibold text-sm">{testimonial.name}</p>
                  <p className="text-xs text-muted-foreground">{testimonial.role}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <div className="flex justify-center pt-4">
        <SubmitTestimonialDialog />
      </div>
    </section>
  );
}
