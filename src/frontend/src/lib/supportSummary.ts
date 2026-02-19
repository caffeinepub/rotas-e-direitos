import { Evidence } from '../types/backend-extended';
import { Appeal } from '../types/backend-extended';

export function generateCaseSummary(
  caseTitle: string,
  platform: string,
  blockDate: string,
  reason: string,
  summary: string,
  evidenceCount: number,
  appealGenerated: boolean
): string {
  return `
Resumo do Caso: ${caseTitle}

Plataforma: ${platform}
Data do Bloqueio: ${blockDate}
Motivo: ${reason}

Descrição:
${summary}

Evidências Anexadas: ${evidenceCount}
Recurso Gerado: ${appealGenerated ? 'Sim' : 'Não'}

---
Este resumo foi gerado automaticamente pelo aplicativo Rotas e Direitos.
  `.trim();
}

export function createSupportEmailWithCase(
  subject: string,
  caseTitle: string,
  platform: string,
  blockDate: string,
  reason: string,
  summary: string,
  evidenceCount: number,
  appealGenerated: boolean
): string {
  const caseSummary = generateCaseSummary(
    caseTitle,
    platform,
    blockDate,
    reason,
    summary,
    evidenceCount,
    appealGenerated
  );

  const body = `
Olá, equipe de suporte,

${caseSummary}

Por favor, revise meu caso e me ajude com os próximos passos.

Atenciosamente
  `.trim();

  const encodedSubject = encodeURIComponent(subject);
  const encodedBody = encodeURIComponent(body);

  return `mailto:suporte@rotasedireitos.com?subject=${encodedSubject}&body=${encodedBody}`;
}
