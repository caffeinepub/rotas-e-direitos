import { Shield, Lock, CheckCircle2 } from 'lucide-react';

export default function TrustBadges() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-4 py-4">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
          <Shield className="h-4 w-4 text-primary" />
        </div>
        <span className="font-medium">Dados Protegidos</span>
      </div>
      
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
          <Lock className="h-4 w-4 text-primary" />
        </div>
        <span className="font-medium">Pagamento Seguro</span>
      </div>
      
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
          <CheckCircle2 className="h-4 w-4 text-primary" />
        </div>
        <span className="font-medium">100% Confiável</span>
      </div>
    </div>
  );
}
