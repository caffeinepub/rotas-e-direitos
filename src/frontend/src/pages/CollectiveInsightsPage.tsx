import CollectiveFilters from '../components/collective/CollectiveFilters';
import PlatformDistribution from '../components/collective/PlatformDistribution';
import ReasonDistribution from '../components/collective/ReasonDistribution';
import TrendChart from '../components/collective/TrendChart';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useState } from 'react';
import { Platform, ReasonCategory, Region } from '../backend';

export default function CollectiveInsightsPage() {
  const [platformFilter, setPlatformFilter] = useState<Platform | null>(null);
  const [reasonFilter, setReasonFilter] = useState<ReasonCategory | null>(null);
  const [regionFilter, setRegionFilter] = useState<Region | null>(null);
  const [periodDays, setPeriodDays] = useState<number>(30);

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-4xl font-bold tracking-tight">Dados Coletivos</h1>
        <p className="text-xl text-muted-foreground">
          Estatísticas anônimas de desativações em Fortaleza e região
        </p>
      </div>

      <Card className="bg-accent/50">
        <CardHeader>
          <CardTitle>Sobre os Dados Coletivos</CardTitle>
          <CardDescription className="text-base">
            Estes dados são compartilhados anonimamente por entregadores que optaram por contribuir. Nenhuma
            informação pessoal (nome, foto, documento) é coletada. Apenas plataforma, região, bairro e motivo da
            desativação são registrados para ajudar a categoria a entender padrões e fortalecer ações coletivas.
          </CardDescription>
        </CardHeader>
      </Card>

      <CollectiveFilters
        platformFilter={platformFilter}
        setPlatformFilter={setPlatformFilter}
        reasonFilter={reasonFilter}
        setReasonFilter={setReasonFilter}
        regionFilter={regionFilter}
        setRegionFilter={setRegionFilter}
        periodDays={periodDays}
        setPeriodDays={setPeriodDays}
      />

      <div className="grid gap-6 md:grid-cols-2">
        <PlatformDistribution
          platformFilter={platformFilter}
          reasonFilter={reasonFilter}
          regionFilter={regionFilter}
          periodDays={periodDays}
        />
        <ReasonDistribution
          platformFilter={platformFilter}
          reasonFilter={reasonFilter}
          regionFilter={regionFilter}
          periodDays={periodDays}
        />
      </div>

      <TrendChart
        platformFilter={platformFilter}
        reasonFilter={reasonFilter}
        regionFilter={regionFilter}
        periodDays={periodDays}
      />
    </div>
  );
}
