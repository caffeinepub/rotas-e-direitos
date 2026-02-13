import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useSubmitCollectiveReport } from '../../hooks/useCollectiveReports';
import { Platform, ReasonCategory, Region } from '../../backend';
import { getNeighborhoods } from '../../lib/collectiveOptions';
import { Loader2 } from 'lucide-react';

interface CollectiveSharePromptProps {
  platform: Platform;
  reason: ReasonCategory;
  onClose: () => void;
}

const regionLabels: Record<Region, string> = {
  [Region.fortaleza]: 'Fortaleza',
  [Region.caucaia]: 'Caucaia',
  [Region.maracanau]: 'Maracanaú',
};

export default function CollectiveSharePrompt({ platform, reason, onClose }: CollectiveSharePromptProps) {
  const [open, setOpen] = useState(true);
  const [region, setRegion] = useState<Region>(Region.fortaleza);
  const [neighborhood, setNeighborhood] = useState('');
  const [dontAskAgain, setDontAskAgain] = useState(false);
  const { mutate: submitReport, isPending } = useSubmitCollectiveReport();

  useEffect(() => {
    const dontAsk = localStorage.getItem('dontAskCollectiveShare');
    if (dontAsk === 'true') {
      setOpen(false);
      onClose();
    }
  }, [onClose]);

  const handleShare = () => {
    if (dontAskAgain) {
      localStorage.setItem('dontAskCollectiveShare', 'true');
    }

    submitReport(
      {
        platform,
        region,
        neighborhood,
        reason,
      },
      {
        onSuccess: () => {
          setOpen(false);
          onClose();
        },
      }
    );
  };

  const handleNotNow = () => {
    if (dontAskAgain) {
      localStorage.setItem('dontAskCollectiveShare', 'true');
    }
    setOpen(false);
    onClose();
  };

  const neighborhoods = getNeighborhoods(region);

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && handleNotNow()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-2xl">Apoie a Categoria</DialogTitle>
          <DialogDescription className="text-base">
            Compartilhar dados anônimos desta desativação ajuda a criar um mapa de bloqueios em Fortaleza.
            Sindicatos podem usar esses dados para ações coletivas.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="region" className="text-base">
              Região
            </Label>
            <Select value={region} onValueChange={(v) => setRegion(v as Region)}>
              <SelectTrigger id="region" className="h-12 text-base">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(regionLabels).map(([key, label]) => (
                  <SelectItem key={key} value={key}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="neighborhood" className="text-base">
              Bairro
            </Label>
            <Select value={neighborhood} onValueChange={setNeighborhood}>
              <SelectTrigger id="neighborhood" className="h-12 text-base">
                <SelectValue placeholder="Selecione..." />
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

          <div className="flex items-center space-x-2 pt-2">
            <Checkbox
              id="dont-ask"
              checked={dontAskAgain}
              onCheckedChange={(checked) => setDontAskAgain(checked as boolean)}
            />
            <Label htmlFor="dont-ask" className="text-sm cursor-pointer">
              Não perguntar novamente
            </Label>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={handleNotNow} size="lg">
            Agora Não
          </Button>
          <Button onClick={handleShare} disabled={!neighborhood || isPending} size="lg">
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Compartilhando...
              </>
            ) : (
              'Compartilhar'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
