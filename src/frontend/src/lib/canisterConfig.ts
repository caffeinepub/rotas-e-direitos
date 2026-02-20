// Get canister ID from environment or window location
export function getCanisterId(): string {
  // Try to get from environment variable (set by dfx during build)
  if (typeof process !== 'undefined' && process.env.CANISTER_ID_BACKEND) {
    return process.env.CANISTER_ID_BACKEND;
  }
  
  // Try to extract from current window location if running on IC
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    // Check if we're on an IC domain (*.ic0.app or *.icp0.io)
    const icDomainMatch = hostname.match(/^([a-z0-9-]+)\.(ic0\.app|icp0\.io|raw\.icp0\.io)$/);
    if (icDomainMatch) {
      return icDomainMatch[1];
    }
  }
  
  // Fallback for local development
  return 'rrkah-fqaaa-aaaaa-aaaaq-cai';
}

export function generateWebhookUrl(): string {
  const id = getCanisterId();
  return `https://${id}.ic0.app/api/pagbank/webhook`;
}
