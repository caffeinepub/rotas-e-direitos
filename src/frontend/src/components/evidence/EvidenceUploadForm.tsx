import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCreateEvidence } from '../../hooks/useEvidence';
import { storeEvidenceImage } from '../../lib/evidenceIndexedDb';
import { EvidenceType, Platform, Region } from '../../backend';
import { Upload, Loader2 } from 'lucide-react';

const regionLabels: Record<Region, string> = {
  [Region.fortaleza]: 'Fortaleza',
  [Region.caucaia]: 'Caucaia',
  [Region.maracanau]: 'Maracanaú',
};

export default function EvidenceUploadForm() {
  const [file, setFile] = useState<File | null>(null);
  const [type, setType] = useState<EvidenceType>(EvidenceType.selfie);
  const [platform, setPlatform] = useState<Platform | ''>('');
  const [region, setRegion] = useState<Region | ''>('');
  const [neighborhood, setNeighborhood] = useState('');
  const [notes, setNotes] = useState('');
  const { mutate: createEvidence, isPending } = useCreateEvidence();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async () => {
      const arrayBuffer = reader.result as ArrayBuffer;

      createEvidence(
        {
          evidenceType: type,
          notes,
          platform: platform || undefined,
          regiao: region || undefined,
          bairro: neighborhood || undefined,
        },
        {
          onSuccess: async (evidence) => {
            await storeEvidenceImage(Number(evidence.id), arrayBuffer);
            setFile(null);
            setNotes('');
            setPlatform('');
            setRegion('');
            setNeighborhood('');
            const fileInput = document.getElementById('file-upload') as HTMLInputElement;
            if (fileInput) fileInput.value = '';
          },
        }
      );
    };
    reader.readAsArrayBuffer(file);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">Adicionar Nova Evidência</CardTitle>
        <CardDescription className="text-base">
          Faça upload de selfies diárias ou prints de avaliações
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="type" className="text-base">
                Tipo de Evidência *
              </Label>
              <Select value={type} onValueChange={(v) => setType(v as EvidenceType)}>
                <SelectTrigger id="type" className="h-12 text-base">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={EvidenceType.selfie}>Selfie Diária</SelectItem>
                  <SelectItem value={EvidenceType.screenshot}>Print de Avaliação</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="platform" className="text-base">
                Plataforma (opcional)
              </Label>
              <Select value={platform} onValueChange={(v) => setPlatform(v as Platform | '')}>
                <SelectTrigger id="platform" className="h-12 text-base">
                  <SelectValue placeholder="Selecione..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Nenhuma</SelectItem>
                  <SelectItem value={Platform.ifood}>iFood</SelectItem>
                  <SelectItem value={Platform.uber}>Uber</SelectItem>
                  <SelectItem value={Platform.rappi}>Rappi</SelectItem>
                  <SelectItem value={Platform.ninetyNine}>99</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="region" className="text-base">
                Região (opcional)
              </Label>
              <Select value={region} onValueChange={(v) => setRegion(v as Region | '')}>
                <SelectTrigger id="region" className="h-12 text-base">
                  <SelectValue placeholder="Selecione..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Nenhuma</SelectItem>
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
                Bairro (opcional)
              </Label>
              <Input
                id="neighborhood"
                value={neighborhood}
                onChange={(e) => setNeighborhood(e.target.value)}
                placeholder="Ex: Aldeota"
                className="h-12 text-base"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="file-upload" className="text-base">
              Arquivo de Imagem *
            </Label>
            <Input
              id="file-upload"
              type="file"
              accept="image/*"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="h-12 text-base cursor-pointer"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes" className="text-base">
              Observações / Tags
            </Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Ex: Chuva forte, trânsito intenso, problema no app..."
              className="min-h-[100px] text-base"
            />
          </div>

          <Button type="submit" disabled={!file || isPending} size="lg" className="w-full">
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Enviando...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                Adicionar Evidência
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
