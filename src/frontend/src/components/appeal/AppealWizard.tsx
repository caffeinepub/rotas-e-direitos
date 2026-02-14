import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Platform } from '../../backend';
import { ReasonCategory } from '../../types/backend-extended';
import { Loader2 } from 'lucide-react';

interface AppealWizardProps {
  onGenerate: (data: {
    platform: Platform;
    reasonCategory: ReasonCategory;
    userExplanation: string;
    evidenceIds: number[];
  }) => void;
  isGenerating?: boolean;
  selectedEvidenceIds?: number[];
}

export default function AppealWizard({ onGenerate, isGenerating, selectedEvidenceIds = [] }: AppealWizardProps) {
  const [platform, setPlatform] = useState<Platform | ''>('');
  const [reasonCategory, setReasonCategory] = useState<ReasonCategory | ''>('');
  const [userExplanation, setUserExplanation] = useState('');

  const handleSubmit = () => {
    if (!platform || !reasonCategory || !userExplanation.trim()) return;

    onGenerate({
      platform: platform as Platform,
      reasonCategory: reasonCategory as ReasonCategory,
      userExplanation,
      evidenceIds: selectedEvidenceIds,
    });
  };

  const isValid = platform && reasonCategory && userExplanation.trim();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Generate Appeal</CardTitle>
        <CardDescription>Provide details to generate your appeal letter</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="platform">Platform</Label>
          <Select value={platform} onValueChange={(value) => setPlatform(value as Platform)}>
            <SelectTrigger id="platform">
              <SelectValue placeholder="Select platform" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="uber">Uber</SelectItem>
              <SelectItem value="ninetyNine">99</SelectItem>
              <SelectItem value="ifood">iFood</SelectItem>
              <SelectItem value="rappi">Rappi</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="reason">Reason for Block</Label>
          <Select value={reasonCategory} onValueChange={(value) => setReasonCategory(value as ReasonCategory)}>
            <SelectTrigger id="reason">
              <SelectValue placeholder="Select reason" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="documentsExpired">Documents Expired</SelectItem>
              <SelectItem value="selfieInvalid">Selfie Invalid</SelectItem>
              <SelectItem value="lowRating">Low Rating</SelectItem>
              <SelectItem value="dangerousConduct">Dangerous Conduct</SelectItem>
              <SelectItem value="fraudSuspicion">Fraud Suspicion</SelectItem>
              <SelectItem value="multipleAccounts">Multiple Accounts</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="explanation">Your Explanation</Label>
          <Textarea
            id="explanation"
            placeholder="Explain your situation in detail..."
            value={userExplanation}
            onChange={(e) => setUserExplanation(e.target.value)}
            rows={6}
          />
        </div>

        {selectedEvidenceIds.length > 0 && (
          <p className="text-sm text-muted-foreground">
            {selectedEvidenceIds.length} evidence item(s) will be referenced
          </p>
        )}

        <Button onClick={handleSubmit} disabled={!isValid || isGenerating} className="w-full">
          {isGenerating ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Generating...
            </>
          ) : (
            'Generate Appeal'
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
