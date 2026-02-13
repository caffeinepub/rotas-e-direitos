import { useState, useEffect } from 'react';
import { useGetCallerUserProfile, useSaveCallerUserProfile } from '../hooks/useUserProfile';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';

export default function ProfileSetupModal() {
  const { data: userProfile, isLoading: profileLoading, isFetched } = useGetCallerUserProfile();
  const { mutate: saveProfile, isPending: isSaving } = useSaveCallerUserProfile();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const showProfileSetup = !profileLoading && isFetched && userProfile === null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      saveProfile({
        name: name.trim(),
        email: email.trim() || undefined,
      });
    }
  };

  if (!showProfileSetup) return null;

  return (
    <Dialog open={showProfileSetup}>
      <DialogContent className="sm:max-w-[425px]" onInteractOutside={(e) => e.preventDefault()}>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="text-2xl">Bem-vindo!</DialogTitle>
            <DialogDescription className="text-base">
              Para começar, precisamos de algumas informações básicas.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-6 py-6">
            <div className="grid gap-2">
              <Label htmlFor="name" className="text-base">
                Nome *
              </Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Seu nome"
                required
                className="h-12 text-base"
                autoFocus
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email" className="text-base">
                E-mail (opcional)
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                className="h-12 text-base"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={!name.trim() || isSaving} size="lg" className="w-full">
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Salvando...
                </>
              ) : (
                'Continuar'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
