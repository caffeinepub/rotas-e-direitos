import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useGetCallerUserProfile, useSaveCallerUserProfile } from '../hooks/useUserProfile';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { toast } from 'sonner';
import { User, Mail, Shield, MapPin, Smartphone, Briefcase } from 'lucide-react';
import { Platform, Region } from '../backend';

export default function ProfilePage() {
  const { data: profile, isLoading } = useGetCallerUserProfile();
  const { identity } = useInternetIdentity();
  const saveProfile = useSaveCallerUserProfile();
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [platform, setPlatform] = useState<Platform | ''>('');
  const [region, setRegion] = useState<Region | ''>('');
  const [phone, setPhone] = useState('');

  useEffect(() => {
    if (profile) {
      setName(profile.name || '');
      setEmail(profile.email || '');
      setPlatform(profile.platform || '');
      setRegion(profile.region || '');
      setPhone(profile.phone || '');
    }
  }, [profile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      toast.error('Por favor, informe seu nome');
      return;
    }

    try {
      await saveProfile.mutateAsync({
        name: name.trim(),
        email: email.trim() || undefined,
        platform: platform || undefined,
        region: region || undefined,
        phone: phone.trim() || undefined,
      });
      toast.success('Perfil atualizado com sucesso!');
    } catch (error) {
      toast.error('Erro ao atualizar perfil');
      console.error('Profile update error:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-pulse text-muted-foreground">Carregando perfil...</div>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-2xl mx-auto">
      <div className="space-y-2">
        <h1 className="text-4xl font-bold tracking-tight">Meu Perfil</h1>
        <p className="text-xl text-muted-foreground">
          Gerencie suas informações pessoais
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Informações Pessoais
          </CardTitle>
          <CardDescription>
            Atualize seus dados cadastrais
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Nome Completo *</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Seu nome completo"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">E-mail (opcional)</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                  className="pl-10"
                />
              </div>
              <p className="text-sm text-muted-foreground">
                Usado para enviar recibos e notificações importantes
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="platform">Plataforma (opcional)</Label>
              <div className="relative">
                <Briefcase className="absolute left-3 top-3 h-4 w-4 text-muted-foreground z-10" />
                <Select value={platform} onValueChange={(value) => setPlatform(value as Platform)}>
                  <SelectTrigger id="platform" className="pl-10">
                    <SelectValue placeholder="Selecione a plataforma" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={Platform.uber}>Uber</SelectItem>
                    <SelectItem value={Platform.ninetyNine}>99</SelectItem>
                    <SelectItem value={Platform.ifood}>iFood</SelectItem>
                    <SelectItem value={Platform.rappi}>Rappi</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <p className="text-sm text-muted-foreground">
                Plataforma principal onde você trabalha
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="region">Região (opcional)</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground z-10" />
                <Select value={region} onValueChange={(value) => setRegion(value as Region)}>
                  <SelectTrigger id="region" className="pl-10">
                    <SelectValue placeholder="Selecione a região" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={Region.fortaleza}>Fortaleza</SelectItem>
                    <SelectItem value={Region.caucaia}>Caucaia</SelectItem>
                    <SelectItem value={Region.maracanau}>Maracanaú</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <p className="text-sm text-muted-foreground">
                Região onde você atua
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Telefone (opcional)</Label>
              <div className="relative">
                <Smartphone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="(85) 99999-9999"
                  className="pl-10"
                />
              </div>
              <p className="text-sm text-muted-foreground">
                Número de contato para comunicações importantes
              </p>
            </div>

            <Button type="submit" size="lg" disabled={saveProfile.isPending}>
              {saveProfile.isPending ? 'Salvando...' : 'Salvar Alterações'}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Identidade Internet Computer
          </CardTitle>
          <CardDescription>
            Sua identidade descentralizada
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Principal ID</Label>
            <div className="p-3 bg-accent rounded-md font-mono text-xs break-all">
              {identity?.getPrincipal().toString() || 'Não autenticado'}
            </div>
          </div>
          <p className="text-sm text-muted-foreground">
            Este é seu identificador único na rede Internet Computer. Seus dados são protegidos e privados.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
