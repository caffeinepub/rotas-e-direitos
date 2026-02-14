import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { MessageSquare, Loader2, CheckCircle2, AlertCircle, Info } from 'lucide-react';
import { useSubmitTestimonial } from '../../hooks/useTestimonials';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';

export default function SubmitTestimonialDialog() {
  const { identity, login } = useInternetIdentity();
  const submitTestimonial = useSubmitTestimonial();
  
  const [open, setOpen] = useState(false);
  const [quote, setQuote] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<{
    quote?: string;
    name?: string;
    role?: string;
  }>({});

  const maxQuoteLength = 500;
  const maxNameLength = 100;
  const maxRoleLength = 100;

  const isAuthenticated = !!identity;

  // Reset all state when dialog opens/closes
  useEffect(() => {
    if (!open) {
      // Clear success and error states when closing
      setShowSuccess(false);
      setError(null);
      setValidationErrors({});
    } else {
      // Clear stale errors when reopening
      setError(null);
      setValidationErrors({});
      setShowSuccess(false);
    }
  }, [open]);

  const validateForm = (): boolean => {
    const errors: typeof validationErrors = {};

    if (!quote.trim()) {
      errors.quote = 'Por favor, insira seu depoimento';
    } else if (quote.length > maxQuoteLength) {
      errors.quote = `O depoimento deve ter no máximo ${maxQuoteLength} caracteres`;
    }

    if (!name.trim()) {
      errors.name = 'Por favor, insira seu nome';
    } else if (name.length > maxNameLength) {
      errors.name = `O nome deve ter no máximo ${maxNameLength} caracteres`;
    }

    if (!role.trim()) {
      errors.role = 'Por favor, insira sua função';
    } else if (role.length > maxRoleLength) {
      errors.role = `A função deve ter no máximo ${maxRoleLength} caracteres`;
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!validateForm()) {
      return;
    }

    try {
      await submitTestimonial.mutateAsync({
        quote: quote.trim(),
        name: name.trim(),
        role: role.trim(),
      });
      
      // Success - show confirmation and reset form
      setShowSuccess(true);
      setQuote('');
      setName('');
      setRole('');
      setValidationErrors({});
    } catch (err: any) {
      // Display sanitized error message from mutation
      setError(err.message || 'Falha ao enviar depoimento');
    }
  };

  const handleDone = () => {
    setOpen(false);
  };

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" size="lg" className="gap-2">
          <MessageSquare className="h-5 w-5" />
          Compartilhe Sua História
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Envie Seu Depoimento</DialogTitle>
          <DialogDescription>
            Compartilhe sua experiência com outros entregadores. Todos os envios são revisados antes de serem publicados.
          </DialogDescription>
        </DialogHeader>

        {showSuccess ? (
          <div className="space-y-4 py-4">
            <Alert className="border-green-600 bg-green-50 dark:bg-green-950">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800 dark:text-green-200">
                Obrigado! Seu depoimento foi enviado e está aguardando revisão. Será publicado assim que aprovado pela nossa equipe.
              </AlertDescription>
            </Alert>
            <DialogFooter>
              <Button onClick={handleDone} className="w-full sm:w-auto">
                Concluir
              </Button>
            </DialogFooter>
          </div>
        ) : (
          <>
            {!isAuthenticated && (
              <Alert className="border-blue-600 bg-blue-50 dark:bg-blue-950">
                <Info className="h-4 w-4 text-blue-600" />
                <AlertDescription className="text-blue-800 dark:text-blue-200">
                  <div className="space-y-2">
                    <p className="font-medium">Login necessário para enviar depoimentos</p>
                    <p className="text-sm">Por favor, faça login para compartilhar sua história com a comunidade.</p>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={login}
                      className="mt-2 border-blue-600 text-blue-800 hover:bg-blue-100 dark:text-blue-200 dark:hover:bg-blue-900"
                    >
                      Fazer Login
                    </Button>
                  </div>
                </AlertDescription>
              </Alert>
            )}

            <Alert variant="default" className="bg-muted/50">
              <Info className="h-4 w-4" />
              <AlertDescription className="text-sm">
                Seu depoimento será revisado pela nossa equipe antes de ser publicado no site.
              </AlertDescription>
            </Alert>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="quote">
                  Seu Depoimento <span className="text-destructive">*</span>
                </Label>
                <Textarea
                  id="quote"
                  placeholder="Compartilhe sua experiência com o app..."
                  value={quote}
                  onChange={(e) => {
                    setQuote(e.target.value);
                    if (validationErrors.quote) {
                      setValidationErrors((prev) => ({ ...prev, quote: undefined }));
                    }
                  }}
                  rows={4}
                  maxLength={maxQuoteLength}
                  disabled={submitTestimonial.isPending}
                  className="resize-none"
                />
                <div className="flex justify-between items-center">
                  {validationErrors.quote && (
                    <p className="text-xs text-destructive">{validationErrors.quote}</p>
                  )}
                  <p className="text-xs text-muted-foreground ml-auto">
                    {quote.length}/{maxQuoteLength}
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="name">
                  Seu Nome <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="name"
                  placeholder="ex: Carlos M."
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (validationErrors.name) {
                      setValidationErrors((prev) => ({ ...prev, name: undefined }));
                    }
                  }}
                  maxLength={maxNameLength}
                  disabled={submitTestimonial.isPending}
                />
                {validationErrors.name && (
                  <p className="text-xs text-destructive">{validationErrors.name}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="role">
                  Sua Função <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="role"
                  placeholder="ex: Entregador iFood"
                  value={role}
                  onChange={(e) => {
                    setRole(e.target.value);
                    if (validationErrors.role) {
                      setValidationErrors((prev) => ({ ...prev, role: undefined }));
                    }
                  }}
                  maxLength={maxRoleLength}
                  disabled={submitTestimonial.isPending}
                />
                {validationErrors.role && (
                  <p className="text-xs text-destructive">{validationErrors.role}</p>
                )}
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setOpen(false)}
                  disabled={submitTestimonial.isPending}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  disabled={submitTestimonial.isPending || !isAuthenticated}
                >
                  {submitTestimonial.isPending ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Enviando...
                    </>
                  ) : (
                    'Enviar Depoimento'
                  )}
                </Button>
              </DialogFooter>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
