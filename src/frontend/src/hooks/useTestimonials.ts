import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { Testimonial, TestimonialStatus } from '../backend';
import { sanitizeTestimonialError } from '../lib/testimonials/testimonialErrorMessages';

// Query keys
export const testimonialKeys = {
  all: ['testimonials'] as const,
  approved: () => [...testimonialKeys.all, 'approved'] as const,
  pending: () => [...testimonialKeys.all, 'pending'] as const,
};

// Fetch approved testimonials (public)
export function useGetApprovedTestimonials() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Testimonial[]>({
    queryKey: testimonialKeys.approved(),
    queryFn: async () => {
      if (!actor) return [];
      return actor.getApprovedTestimonials();
    },
    enabled: !!actor && !actorFetching,
    retry: 1,
    staleTime: 30000, // 30 seconds
  });
}

// Fetch pending testimonials (admin only)
export function useGetPendingTestimonials() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Testimonial[]>({
    queryKey: testimonialKeys.pending(),
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getPendingTestimonials();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });
}

// Submit a new testimonial
export function useSubmitTestimonial() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: { quote: string; name: string; role: string }) => {
      try {
        if (!actor) {
          throw new Error('Actor not available');
        }
        
        // Combine fields into content string
        const content = JSON.stringify({
          quote: params.quote,
          name: params.name,
          role: params.role,
        });
        
        const testimonialId = await actor.submitTestimonial(content);
        return testimonialId;
      } catch (error) {
        // Sanitize and re-throw with user-friendly message
        throw sanitizeTestimonialError(error);
      }
    },
    onSuccess: () => {
      // Invalidate pending testimonials (admin will see it)
      queryClient.invalidateQueries({ queryKey: testimonialKeys.pending() });
    },
  });
}

// Update testimonial status (admin only)
export function useUpdateTestimonialStatus() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: { testimonialId: bigint; newStatus: TestimonialStatus }) => {
      try {
        if (!actor) {
          throw new Error('Actor not available');
        }
        await actor.updateTestimonialStatus(params.testimonialId, params.newStatus);
      } catch (error) {
        // Sanitize and re-throw with user-friendly message
        throw sanitizeTestimonialError(error);
      }
    },
    onSuccess: (_, variables) => {
      // Invalidate both pending and approved queries to refresh lists
      queryClient.invalidateQueries({ queryKey: testimonialKeys.pending() });
      queryClient.invalidateQueries({ queryKey: testimonialKeys.approved() });
    },
  });
}
