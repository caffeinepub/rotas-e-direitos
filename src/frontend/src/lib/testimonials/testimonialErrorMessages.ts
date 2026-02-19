/**
 * Centralized testimonial error sanitizer that converts raw mutation failures
 * into safe, consistent English error messages for user display.
 */

export function sanitizeTestimonialError(error: unknown): Error {
  const rawMessage = error instanceof Error ? error.message : String(error);
  const lowerMessage = rawMessage.toLowerCase();

  // Auth/authorization errors
  if (
    lowerMessage.includes('unauthorized') ||
    lowerMessage.includes('not authenticated') ||
    lowerMessage.includes('must be logged in') ||
    lowerMessage.includes('only authenticated users')
  ) {
    return new Error('You must be logged in to submit a testimonial. Please log in and try again.');
  }

  // Admin-only errors
  if (
    lowerMessage.includes('only admin') ||
    lowerMessage.includes('administrator') ||
    lowerMessage.includes('admin can')
  ) {
    return new Error('Only administrators can perform this action.');
  }

  // Not found errors
  if (lowerMessage.includes('not found')) {
    return new Error('Testimonial not found. It may have already been processed.');
  }

  // Generic retry message for unexpected failures
  return new Error('Something went wrong. Please try again in a moment.');
}
