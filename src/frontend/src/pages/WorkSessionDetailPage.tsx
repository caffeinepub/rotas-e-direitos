import { useParams, useNavigate } from '@tanstack/react-router';
import { useGetWorkSession } from '../hooks/useWorkSessions';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ArrowLeft, Calendar, Clock, MapPin, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { WeatherCondition } from '../backend';

const weatherLabels: Record<WeatherCondition, string> = {
  [WeatherCondition.clear]: 'Limpo',
  [WeatherCondition.cloudy]: 'Nublado',
  [WeatherCondition.rainy]: 'Chuvoso',
  [WeatherCondition.windy]: 'Ventoso',
  [WeatherCondition.soleado]: 'Ensolarado',
  [WeatherCondition.nublado]: 'Nublado',
  [WeatherCondition.tempestuoso]: 'Tempestuoso',
};

export default function WorkSessionDetailPage() {
  const { sessionId } = useParams({ from: '/sessoes/$sessionId' });
  const navigate = useNavigate();
  const { data: session, isLoading } = useGetWorkSession(Number(sessionId));

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!session) {
    return (
      <div className="space-y-6">
        <Button variant="ghost" onClick={() => navigate({ to: '/evidencias' })}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar
        </Button>
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">Sessão não encontrada</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const duration = session.endTime
    ? Math.floor((Number(session.endTime) - Number(session.startTime)) / 1000000000 / 60)
    : null;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <Button variant="ghost" onClick={() => navigate({ to: '/evidencias' })} size="lg">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Voltar para Jornadas
      </Button>

      <Card>
        <CardHeader>
          <CardTitle className="text-3xl">Detalhes da Jornada</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="flex items-start gap-3">
              <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm text-muted-foreground">Início</p>
                <p className="text-lg">
                  {format(new Date(Number(session.startTime) / 1000000), "dd/MM/yyyy 'às' HH:mm", {
                    locale: ptBR,
                  })}
                </p>
              </div>
            </div>

            {session.endTime && (
              <div className="flex items-start gap-3">
                <Clock className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm text-muted-foreground">Fim</p>
                  <p className="text-lg">
                    {format(new Date(Number(session.endTime) / 1000000), "dd/MM/yyyy 'às' HH:mm", {
                      locale: ptBR,
                    })}
                  </p>
                </div>
              </div>
            )}

            <div className="flex items-start gap-3">
              <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm text-muted-foreground">Cidade</p>
                <p className="text-lg">{session.city}</p>
              </div>
            </div>

            {duration !== null && (
              <div className="flex items-start gap-3">
                <Clock className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm text-muted-foreground">Duração</p>
                  <p className="text-lg">
                    {Math.floor(duration / 60)}h {duration % 60}min
                  </p>
                </div>
              </div>
            )}
          </div>

          {session.weatherSamples.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-xl font-semibold">Condições Climáticas Registradas</h3>
              <div className="rounded-lg border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Horário</TableHead>
                      <TableHead>Condição</TableHead>
                      <TableHead>Temperatura</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {session.weatherSamples.map((sample, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          {format(new Date(Number(sample.timestamp) / 1000000), 'HH:mm', { locale: ptBR })}
                        </TableCell>
                        <TableCell>{weatherLabels[sample.condition]}</TableCell>
                        <TableCell>{sample.temperatureC.toFixed(1)}°C</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}

          {session.weatherSamples.length === 0 && (
            <p className="text-center text-muted-foreground py-8">
              Nenhuma amostra climática registrada ainda
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
