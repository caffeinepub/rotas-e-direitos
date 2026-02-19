import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { EvidenceType, Platform, Region } from '../../types/backend-extended';
import { saveEvidenceToIndexedDB } from '../../lib/evidenceIndexedDb';
import { toast } from 'sonner';
import RealTimeCapturePanel from './RealTimeCapturePanel';

export default function EvidenceUploadForm() {
  const [evidenceType, setEvidenceType] = useState<EvidenceType>(EvidenceType.selfie);
  const [notes, setNotes] = useState('');
  const [platform, setPlatform] = useState<Platform | ''>('');
  const [region, setRegion] = useState<Region | ''>('');
  const [neighborhood, setNeighborhood] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFileUpload = async (file: File) => {
    setIsSubmitting(true);
    try {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const arrayBuffer = e.target?.result as ArrayBuffer;
        const bytes = new Uint8Array(arrayBuffer);

        await saveEvidenceToIndexedDB({
          evidenceType,
          notes,
          platform: platform || undefined,
          regiao: region || undefined,
          bairro: neighborhood || undefined,
          mediaBytes: bytes,
        });

        toast.success('Evidência salva com sucesso!');
        setNotes('');
        setPlatform('');
        setRegion('');
        setNeighborhood('');
      };
      reader.readAsArrayBuffer(file);
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Erro ao salvar evidência');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCapturedMedia = async (file: File) => {
    await handleFileUpload(file);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Adicionar Evidência</CardTitle>
        <CardDescription>Capture ou faça upload de evidências</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="capture" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="capture">Captura em Tempo Real</TabsTrigger>
            <TabsTrigger value="upload">Upload de Arquivo</TabsTrigger>
          </TabsList>

          <TabsContent value="capture" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="capture-type">Tipo de Evidência</Label>
              <Select
                value={evidenceType}
                onValueChange={(value) => setEvidenceType(value as EvidenceType)}
              >
                <SelectTrigger id="capture-type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={EvidenceType.selfie}>Selfie</SelectItem>
                  <SelectItem value={EvidenceType.screenshot}>Screenshot</SelectItem>
                  <SelectItem value={EvidenceType.audio}>Áudio</SelectItem>
                  <SelectItem value={EvidenceType.video}>Vídeo</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <RealTimeCapturePanel
              onCapture={handleCapturedMedia}
            />

            <div className="space-y-2">
              <Label htmlFor="capture-notes">Notas</Label>
              <Textarea
                id="capture-notes"
                placeholder="Adicione notas sobre esta evidência..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="capture-platform">Plataforma (opcional)</Label>
                <Select value={platform} onValueChange={(value) => setPlatform(value as Platform)}>
                  <SelectTrigger id="capture-platform">
                    <SelectValue placeholder="Selecione..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={Platform.ifood}>iFood</SelectItem>
                    <SelectItem value={Platform.uber}>Uber</SelectItem>
                    <SelectItem value={Platform.rappi}>Rappi</SelectItem>
                    <SelectItem value={Platform.ninetyNine}>99</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="capture-region">Região (opcional)</Label>
                <Select value={region} onValueChange={(value) => setRegion(value as Region)}>
                  <SelectTrigger id="capture-region">
                    <SelectValue placeholder="Selecione..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={Region.fortaleza}>Fortaleza</SelectItem>
                    <SelectItem value={Region.caucaia}>Caucaia</SelectItem>
                    <SelectItem value={Region.maracanau}>Maracanaú</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {region && (
              <div className="space-y-2">
                <Label htmlFor="capture-neighborhood">Bairro (opcional)</Label>
                <Input
                  id="capture-neighborhood"
                  placeholder="Digite o bairro..."
                  value={neighborhood}
                  onChange={(e) => setNeighborhood(e.target.value)}
                />
              </div>
            )}
          </TabsContent>

          <TabsContent value="upload" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="upload-type">Tipo de Evidência</Label>
              <Select
                value={evidenceType}
                onValueChange={(value) => setEvidenceType(value as EvidenceType)}
              >
                <SelectTrigger id="upload-type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={EvidenceType.selfie}>Selfie</SelectItem>
                  <SelectItem value={EvidenceType.screenshot}>Screenshot</SelectItem>
                  <SelectItem value={EvidenceType.audio}>Áudio</SelectItem>
                  <SelectItem value={EvidenceType.video}>Vídeo</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="file-upload">Arquivo</Label>
              <Input
                id="file-upload"
                type="file"
                accept={
                  evidenceType === EvidenceType.audio
                    ? 'audio/*'
                    : evidenceType === EvidenceType.video
                    ? 'video/*'
                    : 'image/*'
                }
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFileUpload(file);
                }}
                disabled={isSubmitting}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="upload-notes">Notas</Label>
              <Textarea
                id="upload-notes"
                placeholder="Adicione notas sobre esta evidência..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="upload-platform">Plataforma (opcional)</Label>
                <Select value={platform} onValueChange={(value) => setPlatform(value as Platform)}>
                  <SelectTrigger id="upload-platform">
                    <SelectValue placeholder="Selecione..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={Platform.ifood}>iFood</SelectItem>
                    <SelectItem value={Platform.uber}>Uber</SelectItem>
                    <SelectItem value={Platform.rappi}>Rappi</SelectItem>
                    <SelectItem value={Platform.ninetyNine}>99</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="upload-region">Região (opcional)</Label>
                <Select value={region} onValueChange={(value) => setRegion(value as Region)}>
                  <SelectTrigger id="upload-region">
                    <SelectValue placeholder="Selecione..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={Region.fortaleza}>Fortaleza</SelectItem>
                    <SelectItem value={Region.caucaia}>Caucaia</SelectItem>
                    <SelectItem value={Region.maracanau}>Maracanaú</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {region && (
              <div className="space-y-2">
                <Label htmlFor="upload-neighborhood">Bairro (opcional)</Label>
                <Input
                  id="upload-neighborhood"
                  placeholder="Digite o bairro..."
                  value={neighborhood}
                  onChange={(e) => setNeighborhood(e.target.value)}
                />
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
