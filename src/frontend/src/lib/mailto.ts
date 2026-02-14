import { Platform } from '../backend';

const PLATFORM_EMAILS: Record<Platform, string> = {
  ifood: 'suporte@ifood.com.br',
  uber: 'support@uber.com',
  rappi: 'soporte@rappi.com',
  ninetyNine: 'suporte@99app.com',
};

export function getPlatformEmail(platform: Platform): string {
  return PLATFORM_EMAILS[platform] || 'support@example.com';
}

export function createAppealMailto(platform: Platform, subject: string, body: string): string {
  const email = getPlatformEmail(platform);
  const encodedSubject = encodeURIComponent(subject);
  const encodedBody = encodeURIComponent(body);
  return `mailto:${email}?subject=${encodedSubject}&body=${encodedBody}`;
}

export function createSupportMailto(subject: string, body: string, email: string = 'support@rotasedireitos.com'): string {
  const encodedSubject = encodeURIComponent(subject);
  const encodedBody = encodeURIComponent(body);
  return `mailto:${email}?subject=${encodedSubject}&body=${encodedBody}`;
}
