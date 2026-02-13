import { Platform } from '../backend';

const platformEmails: Record<Platform, string> = {
  [Platform.ifood]: 'suporte@ifood.com.br',
  [Platform.uber]: 'suporte@uber.com',
  [Platform.rappi]: 'ajuda@rappi.com',
  [Platform.ninetyNine]: 'suporte@99app.com',
};

const platformSubjects: Record<Platform, string> = {
  [Platform.ifood]: 'Recurso - Desativação',
  [Platform.uber]: 'Appeal: Driver deactivation',
  [Platform.rappi]: 'Revisão de conta - Entregador',
  [Platform.ninetyNine]: 'Recurso de desativação - Motorista',
};

export function buildMailtoLink(platform: Platform, appealText: string): string {
  const email = platformEmails[platform];
  const subject = platformSubjects[platform];

  const params = new URLSearchParams({
    subject,
    body: appealText,
  });

  return `mailto:${email}?${params.toString()}`;
}
