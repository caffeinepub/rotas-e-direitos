import { useNavigate } from '@tanstack/react-router';
import { useGetAllWorkSessions } from '../../hooks/useWorkSessions';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Clock, MapPin, Loader2 } from 'lucide-react';

interface WorkSessionsListProps {
  activeSessionId: number | null;
}

export default function WorkSessionsList({ activeSessionId }: WorkSessionsListProps) {
  const { data: sessions = [], isLoading } = useGetAllWorkSessions();
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  if (sessions.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-lg text-muted-foreground">Nenhuma jornada registrada ainda</p>
          <p className="text-sm text-muted-foreground mt-2">Inicie sua primeira jornada acima</p>
        </CardContent>
      </Card>
    );
  }

  const handleSessionClick = (sessionId: bigint) => {
    navigate({ to: '/sessoes/$sessionId', params: { sessionId: String(sessionId) } });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">Histórico de Jornadas</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {sessions.map((session) => {
          const isActive = Number(session.id) === activeSessionId;
          return (
            <Card
              key={Number(session.id)}
              className="transition-all hover:shadow-md cursor-pointer"
              onClick={() => handleSessionClick(session.id)}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{session.city}</span>
                      {isActive && (
                        <Badge variant="default" className="ml-2">
                          Em Andamento
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {format(new Date(Number(session.startTime) / 1000000), "dd/MM/yyyy 'às' HH:mm", {
                        locale: ptBR,
                      })}
                      {session.endTime &&
                        ` - ${format(new Date(Number(session.endTime) / 1000000), 'HH:mm', { locale: ptBR })}`}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {session.weatherSamples.length} amostra(s) climática(s)
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </CardContent>
    </Card>
  );
}
