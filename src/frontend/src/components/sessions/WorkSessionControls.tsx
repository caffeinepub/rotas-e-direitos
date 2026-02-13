import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useLogWorkSession, useEndWorkSession, useAddWeatherSample } from '../../hooks/useWorkSessions';
import { fetchWeather } from '../../lib/weatherClient';
import { Play, Square, Loader2 } from 'lucide-react';

interface WorkSessionControlsProps {
  activeSessionId: number | null;
  setActiveSessionId: (id: number | null) => void;
}

const cities = ['Fortaleza', 'Caucaia', 'Maracanaú'];

export default function WorkSessionControls({ activeSessionId, setActiveSessionId }: WorkSessionControlsProps) {
  const [city, setCity] = useState('Fortaleza');
  const { mutate: startSession, isPending: isStarting } = useLogWorkSession();
  const { mutate: endSession, isPending: isEnding } = useEndWorkSession();
  const { mutate: addWeatherSample } = useAddWeatherSample();

  useEffect(() => {
    if (!activeSessionId) return;

    const interval = setInterval(async () => {
      try {
        const weather = await fetchWeather(city);
        addWeatherSample({
          sessionId: activeSessionId,
          condition: weather.condition,
          temperatureC: weather.temperatureC,
        });
      } catch (error) {
        console.error('Failed to fetch weather:', error);
      }
    }, 30 * 60 * 1000); // 30 minutes

    // Fetch immediately on start
    fetchWeather(city)
      .then((weather) => {
        addWeatherSample({
          sessionId: activeSessionId,
          condition: weather.condition,
          temperatureC: weather.temperatureC,
        });
      })
      .catch(console.error);

    return () => clearInterval(interval);
  }, [activeSessionId, city, addWeatherSample]);

  const handleStart = () => {
    startSession(
      { city },
      {
        onSuccess: (session) => {
          setActiveSessionId(Number(session.id));
        },
      }
    );
  };

  const handleEnd = () => {
    if (!activeSessionId) return;
    endSession(activeSessionId, {
      onSuccess: () => {
        setActiveSessionId(null);
      },
    });
  };

  return (
    <div className="space-y-4">
      {!activeSessionId ? (
        <>
          <div className="space-y-2">
            <Label htmlFor="city" className="text-base">
              Cidade
            </Label>
            <Select value={city} onValueChange={setCity}>
              <SelectTrigger id="city" className="h-12 text-base">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {cities.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button onClick={handleStart} disabled={isStarting} size="lg" className="w-full">
            {isStarting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Iniciando...
              </>
            ) : (
              <>
                <Play className="mr-2 h-4 w-4" />
                Iniciar Jornada
              </>
            )}
          </Button>
        </>
      ) : (
        <div className="space-y-4">
          <div className="p-4 bg-accent rounded-lg">
            <p className="text-sm text-muted-foreground">Jornada em andamento</p>
            <p className="text-lg font-semibold">{city}</p>
            <p className="text-sm text-muted-foreground mt-1">
              Condições climáticas sendo registradas a cada 30 minutos
            </p>
          </div>
          <Button onClick={handleEnd} disabled={isEnding} variant="destructive" size="lg" className="w-full">
            {isEnding ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Encerrando...
              </>
            ) : (
              <>
                <Square className="mr-2 h-4 w-4" />
                Encerrar Jornada
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  );
}
