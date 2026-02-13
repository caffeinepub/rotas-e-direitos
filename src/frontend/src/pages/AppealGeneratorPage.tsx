import AuthGate from '../components/AuthGate';
import AppealWizard from '../components/appeal/AppealWizard';

export default function AppealGeneratorPage() {
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="space-y-2">
        <h1 className="text-4xl font-bold tracking-tight">Gerador de Recursos</h1>
        <p className="text-xl text-muted-foreground">
          Crie recursos profissionais para contestar desativações
        </p>
      </div>

      <AuthGate message="Entre para gerar recursos e contestar desativações.">
        <AppealWizard />
      </AuthGate>
    </div>
  );
}
