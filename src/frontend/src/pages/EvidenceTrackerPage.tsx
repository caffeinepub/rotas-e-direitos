import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AuthGate from '../components/AuthGate';
import EvidenceUploadForm from '../components/evidence/EvidenceUploadForm';
import EvidenceTimeline from '../components/evidence/EvidenceTimeline';
import WorkSessionsSection from '../components/sessions/WorkSessionsSection';

export default function EvidenceTrackerPage() {
  const [activeTab, setActiveTab] = useState('evidencias');

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-4xl font-bold tracking-tight">Rastreador de Evidências</h1>
        <p className="text-xl text-muted-foreground">
          Organize suas provas e registre suas jornadas de trabalho
        </p>
      </div>

      <AuthGate message="Entre para começar a registrar evidências e jornadas de trabalho.">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-2 h-12">
            <TabsTrigger value="evidencias" className="text-base">
              Evidências
            </TabsTrigger>
            <TabsTrigger value="jornadas" className="text-base">
              Jornadas
            </TabsTrigger>
          </TabsList>

          <TabsContent value="evidencias" className="space-y-6">
            <EvidenceUploadForm />
            <EvidenceTimeline />
          </TabsContent>

          <TabsContent value="jornadas">
            <WorkSessionsSection />
          </TabsContent>
        </Tabs>
      </AuthGate>
    </div>
  );
}
