import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Share2, Loader2, CheckCircle2, Info } from 'lucide-react';
import { useSubmitCollectiveReport } from '../../hooks/useCollectiveReports';
import { toast } from 'sonner';
import { ReasonCategory } from '../../types/backend-extended';
import { Platform, Region } from '../../backend';
import { getNeighborhoods } from '../../lib/collectiveOptions';

export default function CollectiveSharePrompt() {
  const [platform, setPlatform] = useState<Platform | ''>('');
  const [region, setRegion] = useState<Region | ''>('');
  const [neighborhood, setNeighborhood] = useState('');
  const [reason, setReason] = useState<ReasonCategory | ''>('');

  const submitReport = useSubmitCollectiveReport();

  const neighborhoods = region ? getNeighborhoods(region) : [];

  const handleSubmit = async () => {
    if (!platform || !region || !neighborhood || !reason) {
      toast.error('Please fill all fields');
      return;
    }

    try {
      await submitReport.mutateAsync({
        platform: platform as Platform,
        region: region as Region,
        neighborhood,
        reason: reason as ReasonCategory,
      });
      toast.success('Report submitted successfully');
      // Reset form
      setPlatform('');
      setRegion('');
      setNeighborhood('');
      setReason('');
    } catch (error: any) {
      toast.error(error.message || 'Failed to submit report');
    }
  };

  const isValid = platform && region && neighborhood && reason;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Share2 className="h-5 w-5" />
          Share Your Experience
        </CardTitle>
        <CardDescription>
          Help build collective data by sharing your block information
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            Your submission is anonymous and helps identify patterns of unfair blocks
          </AlertDescription>
        </Alert>

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
          <Label htmlFor="region">Region</Label>
          <Select value={region} onValueChange={(value) => {
            setRegion(value as Region);
            setNeighborhood('');
          }}>
            <SelectTrigger id="region">
              <SelectValue placeholder="Select region" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="fortaleza">Fortaleza</SelectItem>
              <SelectItem value="caucaia">Caucaia</SelectItem>
              <SelectItem value="maracanau">Maracanaú</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="neighborhood">Neighborhood</Label>
          <Select value={neighborhood} onValueChange={setNeighborhood} disabled={!region}>
            <SelectTrigger id="neighborhood">
              <SelectValue placeholder={region ? "Select neighborhood" : "Select region first"} />
            </SelectTrigger>
            <SelectContent>
              {neighborhoods.map((n) => (
                <SelectItem key={n} value={n}>
                  {n}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="reason">Reason for Block</Label>
          <Select value={reason} onValueChange={(value) => setReason(value as ReasonCategory)}>
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

        <Button
          onClick={handleSubmit}
          disabled={!isValid || submitReport.isPending}
          className="w-full"
        >
          {submitReport.isPending ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Submitting...
            </>
          ) : submitReport.isSuccess ? (
            <>
              <CheckCircle2 className="h-4 w-4 mr-2" />
              Submitted
            </>
          ) : (
            <>
              <Share2 className="h-4 w-4 mr-2" />
              Submit Report
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
