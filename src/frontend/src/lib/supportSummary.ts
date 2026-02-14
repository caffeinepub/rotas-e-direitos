import { Evidence } from '../backend';
import { Appeal } from '../types/backend-extended';

export function generateCaseSummary(
  caseData: {
    platform: string;
    blockDate: number;
    reasonCategory: string;
    incidentSummary: string;
  },
  evidence: Evidence[],
  appeals: Appeal[]
): string {
  const blockDateStr = new Date(caseData.blockDate).toLocaleDateString();

  let summary = `CASE SUMMARY\n\n`;
  summary += `Platform: ${caseData.platform}\n`;
  summary += `Block Date: ${blockDateStr}\n`;
  summary += `Reason: ${caseData.reasonCategory}\n\n`;
  summary += `Incident Summary:\n${caseData.incidentSummary}\n\n`;

  if (evidence.length > 0) {
    summary += `Evidence Attached: ${evidence.length} item(s)\n`;
    evidence.forEach((e, i) => {
      summary += `  ${i + 1}. ${e.evidenceType} - ${e.notes}\n`;
    });
    summary += `\n`;
  }

  if (appeals.length > 0) {
    summary += `Appeals Generated: ${appeals.length}\n\n`;
  }

  return summary;
}

export function createSupportMailto(
  subject: string,
  body: string,
  attachmentReminder: boolean = true
): string {
  let finalBody = body;

  if (attachmentReminder) {
    finalBody += `\n\n[IMPORTANT: Please attach your evidence files before sending]`;
  }

  const encodedSubject = encodeURIComponent(subject);
  const encodedBody = encodeURIComponent(finalBody);

  return `mailto:support@example.com?subject=${encodedSubject}&body=${encodedBody}`;
}
