import { useState, useEffect } from 'react';
import { useGetAppeal } from '../../hooks/useAppeals';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Platform } from '../../backend';
import SendViaEmailButton from './SendViaEmailButton';
import { Download, Loader2 } from 'lucide-react';

interface AppealEditorProps {
  appealId: number;
  platform: Platform;
}

export default function AppealEditor({ appealId, platform }: AppealEditorProps) {
  const { data: appeal, isLoading } = useGetAppeal(appealId);
  const [editedText, setEditedText] = useState('');

  useEffect(() => {
    if (appeal) {
      setEditedText(appeal.generatedText);
    }
  }, [appeal]);

  const handleDownload = () => {
    const blob = new Blob([editedText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'recurso-desativacao.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!appeal) {
    return <p className="text-center text-muted-foreground">Recurso não encontrado</p>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6 space-y-4">
          <div>
            <p className="text-sm text-muted-foreground mb-2">
              Revise e edite o texto do recurso conforme necessário:
            </p>
            <Textarea
              value={editedText}
              onChange={(e) => setEditedText(e.target.value)}
              className="min-h-[300px] text-base font-mono"
            />
          </div>

          <div className="flex gap-4">
            <Button onClick={handleDownload} variant="outline" size="lg" className="flex-1">
              <Download className="mr-2 h-4 w-4" />
              Baixar .txt
            </Button>
            <SendViaEmailButton platform={platform} appealText={editedText} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
