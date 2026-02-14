export interface Template {
  id: string;
  title: string;
  category: string;
  platform?: string;
  reason?: string;
  content: string;
  tags: string[];
}

export const TEMPLATE_CATEGORIES = [
  { id: 'appeals', label: 'Appeal Templates' },
  { id: 'rights', label: 'Driver Rights' },
  { id: 'evidence', label: 'Evidence Guidelines' },
  { id: 'communication', label: 'Communication Templates' },
];

export const TEMPLATES: Template[] = [
  {
    id: 'ifood_docs_appeal',
    title: 'iFood - Expired Documents Appeal',
    category: 'appeals',
    platform: 'ifood',
    reason: 'documentsExpired',
    content: `Subject: Request for Account Reactivation - Updated Documents

Dear iFood Support Team,

I am writing to request the reactivation of my delivery partner account, which was deactivated due to expired documents.

I have now updated all required documents and uploaded them to the platform. All documents are current and valid.

I have been a dedicated partner and would like to continue providing quality service to iFood customers.

Please review my updated documents and reactivate my account at your earliest convenience.

Thank you for your attention to this matter.

Best regards,
[Your Name]`,
    tags: ['ifood', 'documents', 'appeal'],
  },
  {
    id: 'uber_rating_appeal',
    title: 'Uber - Low Rating Appeal',
    category: 'appeals',
    platform: 'uber',
    reason: 'lowRating',
    content: `Subject: Appeal for Account Review - Rating Concerns

Dear Uber Support,

I am reaching out regarding the recent deactivation of my driver account due to rating concerns.

I have always strived to provide excellent service to riders. I believe some recent ratings may not accurately reflect my service quality due to circumstances beyond my control.

I am committed to improving and maintaining high standards. I request a review of my account and the opportunity to continue driving with Uber.

I am available to discuss this matter further and provide any additional information needed.

Thank you for your consideration.

Sincerely,
[Your Name]`,
    tags: ['uber', 'rating', 'appeal'],
  },
  {
    id: 'driver_rights_overview',
    title: 'Overview of Driver Rights',
    category: 'rights',
    content: `Driver Rights and Protections

As a gig economy worker, you have certain rights and protections:

1. Right to Fair Treatment
   - You should be treated fairly and without discrimination
   - Deactivations should be based on clear, documented reasons

2. Right to Appeal
   - You have the right to appeal any deactivation decision
   - You should be given a clear explanation of the reason for deactivation

3. Right to Evidence
   - You can request information about complaints or issues
   - You should be allowed to provide your side of the story

4. Right to Data Access
   - You can request access to your personal data
   - You can request corrections to inaccurate information

5. Right to Support
   - You should have access to support channels
   - Your concerns should be addressed in a timely manner

Remember: Always document your work, keep records of communications, and gather evidence to support your case.`,
    tags: ['rights', 'overview', 'protection'],
  },
  {
    id: 'evidence_collection_guide',
    title: 'Evidence Collection Best Practices',
    category: 'evidence',
    content: `How to Collect and Organize Evidence

Effective evidence collection is crucial for defending your case:

1. Daily Documentation
   - Take daily selfies to prove you're the account user
   - Screenshot your ratings and earnings regularly
   - Save all communication with support

2. Incident Documentation
   - If something unusual happens, document it immediately
   - Take photos/videos of relevant situations
   - Note date, time, and location

3. Work Session Records
   - Log your work hours and conditions
   - Record weather conditions during shifts
   - Keep track of completed deliveries/rides

4. Communication Records
   - Save all emails and in-app messages
   - Screenshot important conversations
   - Keep a log of phone calls (date, time, summary)

5. Organization Tips
   - Label everything clearly with dates
   - Store evidence in multiple locations
   - Create a timeline of events

The more organized your evidence, the stronger your case will be.`,
    tags: ['evidence', 'documentation', 'guide'],
  },
  {
    id: 'support_contact_template',
    title: 'Professional Support Contact Template',
    category: 'communication',
    content: `Subject: Account Issue - Request for Review [Your Account ID]

Dear Support Team,

I am writing to bring to your attention an issue with my account that requires your review.

Account Details:
- Name: [Your Name]
- Account ID: [Your ID]
- Platform: [Platform Name]
- Issue Date: [Date]

Issue Description:
[Clearly describe the issue in 2-3 sentences]

Actions Taken:
[List what you've already done to resolve this]

Request:
[Clearly state what you're asking for]

I have attached relevant documentation to support my case. I am available for any additional information or clarification you may need.

I appreciate your prompt attention to this matter and look forward to your response.

Thank you,
[Your Name]
[Contact Information]`,
    tags: ['communication', 'support', 'template'],
  },
  {
    id: 'rappi_general_appeal',
    title: 'Rappi - General Account Appeal',
    category: 'appeals',
    platform: 'rappi',
    content: `Subject: Account Reactivation Request

Dear Rappi Team,

I am writing to request a review of my account deactivation.

Since joining Rappi, I have been committed to maintaining high standards and providing excellent service to customers. I believe the deactivation may have been based on a misunderstanding or incomplete information.

I would like the opportunity to present my case and provide any necessary documentation to support my appeal.

I am eager to continue working with Rappi and contributing to the platform's success.

Please let me know what additional information you need from me.

Thank you for your consideration.

Best regards,
[Your Name]`,
    tags: ['rappi', 'appeal', 'general'],
  },
  {
    id: '99_fraud_appeal',
    title: '99 - Fraud Suspicion Appeal',
    category: 'appeals',
    platform: 'ninetyNine',
    reason: 'fraudSuspicion',
    content: `Subject: Appeal - Fraud Suspicion Clarification

Dear 99 Support,

I am writing regarding the deactivation of my driver account due to suspected fraudulent activity.

I want to assure you that I have never engaged in any fraudulent behavior. I have always operated my account honestly and in accordance with 99's terms of service.

I believe this may be a misunderstanding, and I am prepared to provide any documentation or information needed to clarify the situation.

I have only one account with 99 and have never attempted to manipulate the system in any way.

I respectfully request a thorough review of my account and the opportunity to address any specific concerns.

Thank you for your time and consideration.

Sincerely,
[Your Name]`,
    tags: ['99', 'fraud', 'appeal'],
  },
];

export function getTemplatesByCategory(category: string): Template[] {
  return TEMPLATES.filter((t) => t.category === category);
}

export function getTemplateById(id: string): Template | undefined {
  return TEMPLATES.find((t) => t.id === id);
}

export function searchTemplates(query: string): Template[] {
  const lowerQuery = query.toLowerCase();
  return TEMPLATES.filter(
    (t) =>
      t.title.toLowerCase().includes(lowerQuery) ||
      t.content.toLowerCase().includes(lowerQuery) ||
      t.tags.some((tag) => tag.toLowerCase().includes(lowerQuery))
  );
}
