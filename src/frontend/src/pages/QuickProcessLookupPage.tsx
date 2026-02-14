import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Search, FileSearch, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function QuickProcessLookupPage() {
  const [processNumber, setProcessNumber] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Placeholder for future implementation
  };

  return (
    <div className="space-y-8 max-w-3xl mx-auto">
      <div className="space-y-2">
        <h1 className="text-4xl font-bold tracking-tight">Consulta Rápida de Processos</h1>
        <p className="text-xl text-muted-foreground">
          Acompanhe o status dos seus recursos e processos
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Buscar Processo
          </CardTitle>
          <CardDescription>
            Digite o número do processo ou protocolo para consultar
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="processNumber">Número do Processo</Label>
              <Input
                id="processNumber"
                value={processNumber}
                onChange={(e) => setProcessNumber(e.target.value)}
                placeholder="Ex: 0000000-00.0000.0.00.0000"
              />
            </div>
            <Button type="submit" size="lg" className="w-full md:w-auto">
              <Search className="mr-2 h-4 w-4" />
              Consultar
            </Button>
          </form>
        </CardContent>
      </Card>

      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          <strong>Em Desenvolvimento:</strong> Esta funcionalidade estará disponível em breve. Você poderá
          acompanhar o andamento dos seus recursos administrativos e processos judiciais diretamente pelo aplicativo.
        </AlertDescription>
      </Alert>

      <Card className="bg-accent/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileSearch className="h-5 w-5" />
            Recursos Futuros
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>• Acompanhamento em tempo real do status dos recursos</li>
            <li>• Notificações sobre atualizações nos processos</li>
            <li>• Histórico completo de todas as movimentações</li>
            <li>• Integração com sistemas judiciais e administrativos</li>
            <li>• Documentos e decisões disponíveis para download</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
