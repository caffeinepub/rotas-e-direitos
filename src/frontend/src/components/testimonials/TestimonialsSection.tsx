import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MessageSquare } from 'lucide-react';
import { useGetApprovedTestimonials } from '../../hooks/useTestimonials';
import { testimonials } from './testimonialsData';
import { Skeleton } from '@/components/ui/skeleton';
import { useState } from 'react';
import SubmitTestimonialDialog from './SubmitTestimonialDialog';

export default function TestimonialsSection() {
  const { data: backendTestimonials, isLoading } = useGetApprovedTestimonials();

  const displayTestimonials =
    backendTestimonials && backendTestimonials.length > 0
      ? backendTestimonials.map((t) => ({
          quote: t.content,
          name: 'Anônimo',
          role: 'Entregador',
        }))
      : testimonials;

  return (
    <section className="py-16 bg-gradient-to-b from-background to-muted/20">
      <div className="container px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            O Que Dizem os Entregadores
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Histórias reais de quem usa nossa plataforma para defender seus direitos
          </p>
        </div>

        {isLoading ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="shadow-md">
                <CardContent className="pt-6">
                  <Skeleton className="h-24 w-full mb-4" />
                  <Skeleton className="h-4 w-32 mb-2" />
                  <Skeleton className="h-3 w-24" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
            {displayTestimonials.map((testimonial, index) => (
              <Card key={index} className="shadow-md hover:shadow-lg transition-all border-border/60">
                <CardContent className="pt-6">
                  <p className="text-base italic mb-4 text-foreground/90">"{testimonial.quote}"</p>
                  <div className="border-t border-border/50 pt-4">
                    <p className="font-semibold text-foreground">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <div className="text-center">
          <SubmitTestimonialDialog />
        </div>
      </div>
    </section>
  );
}
