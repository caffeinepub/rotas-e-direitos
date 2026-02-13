import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import WorkSessionControls from './WorkSessionControls';
import WorkSessionsList from './WorkSessionsList';

export default function WorkSessionsSection() {
  const [activeSessionId, setActiveSessionId] = useState<number | null>(null);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Registrar Jornada de Trabalho</CardTitle>
          <CardDescription className="text-base">
            Inicie uma jornada para registrar automaticamente as condições climáticas durante seu trabalho
          </CardDescription>
        </CardHeader>
        <CardContent>
          <WorkSessionControls activeSessionId={activeSessionId} setActiveSessionId={setActiveSessionId} />
        </CardContent>
      </Card>

      <WorkSessionsList activeSessionId={activeSessionId} />
    </div>
  );
}
