import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useGetCallerLossProfile, useSetLossProfile } from '../../hooks/useLossProfile';
import { Platform } from '../../backend';
import { Loader2, Save } from 'lucide-react';

export default function LossProfileForm() {
  const { data: profile } = useGetCallerLossProfile();
  const { mutate: saveProfile, isPending } = useSetLossProfile();

  const [dailyEarnings, setDailyEarnings] = useState('');
  const [daysPerWeek, setDaysPerWeek] = useState('5');
  const [deactivationDate, setDeactivationDate] = useState('');
  const [platform, setPlatform] = useState<Platform>(Platform.ifood);

  useEffect(() => {
    if (profile) {
      setDailyEarnings(profile.dailyEarnings.toString());
      setDaysPerWeek(profile.daysPerWeek.toString());
      setDeactivationDate(
        new Date(Number(profile.deactivationDate) / 1000000).toISOString().split('T')[0]
      );
      setPlatform(profile.platform);
    }
  }, [profile]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const earnings = parseFloat(dailyEarnings);
    if (earnings <= 0) {
      alert('O ganho diário deve ser maior que zero');
      return;
    }

    const dateMs = new Date(deactivationDate).getTime();
    const dateNs = BigInt(dateMs) * BigInt(1000000);

    saveProfile({
      dailyEarnings: earnings,
      daysPerWeek: BigInt(daysPerWeek),
      deactivationDate: dateNs,
      platform,
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">Perfil Financeiro</CardTitle>
        <CardDescription className="text-base">
          Informe seus dados para calcular as perdas causadas pela desativação
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="daily-earnings" className="text-base">
                Ganho Médio Diário (R$) *
              </Label>
              <Input
                id="daily-earnings"
                type="number"
                step="0.01"
                min="0.01"
                value={dailyEarnings}
                onChange={(e) => setDailyEarnings(e.target.value)}
                placeholder="150.00"
                required
                className="h-12 text-base"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="days-per-week" className="text-base">
                Dias por Semana *
              </Label>
              <Select value={daysPerWeek} onValueChange={setDaysPerWeek}>
                <SelectTrigger id="days-per-week" className="h-12 text-base">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5, 6, 7].map((n) => (
                    <SelectItem key={n} value={n.toString()}>
                      {n} {n === 1 ? 'dia' : 'dias'}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="deactivation-date" className="text-base">
                Data da Desativação *
              </Label>
              <Input
                id="deactivation-date"
                type="date"
                value={deactivationDate}
                onChange={(e) => setDeactivationDate(e.target.value)}
                required
                className="h-12 text-base"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="platform" className="text-base">
                Plataforma *
              </Label>
              <Select value={platform} onValueChange={(v) => setPlatform(v as Platform)}>
                <SelectTrigger id="platform" className="h-12 text-base">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={Platform.ifood}>iFood</SelectItem>
                  <SelectItem value={Platform.uber}>Uber</SelectItem>
                  <SelectItem value={Platform.rappi}>Rappi</SelectItem>
                  <SelectItem value={Platform.ninetyNine}>99</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button type="submit" disabled={isPending} size="lg" className="w-full">
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Salvando...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Salvar Perfil
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
