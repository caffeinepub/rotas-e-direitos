import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function PrivacyPolicyPage() {
  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="space-y-2">
        <h1 className="text-4xl font-bold tracking-tight">Política de Privacidade</h1>
        <p className="text-muted-foreground">
          Última atualização: {new Date().toLocaleDateString('pt-BR')}
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Compromisso com sua Privacidade</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[600px] pr-4">
            <div className="space-y-6 text-sm">
              <section>
                <h3 className="text-lg font-semibold mb-3">1. Introdução</h3>
                <p className="text-muted-foreground leading-relaxed">
                  O aplicativo ROTAS E DIREITOS está comprometido em proteger a privacidade e os dados pessoais
                  de seus usuários. Esta Política de Privacidade descreve como coletamos, usamos, armazenamos
                  e protegemos suas informações quando você utiliza nossos serviços.
                </p>
              </section>

              <section>
                <h3 className="text-lg font-semibold mb-3">2. Dados Coletados</h3>
                <p className="text-muted-foreground leading-relaxed mb-2">
                  Coletamos os seguintes tipos de informações:
                </p>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4">
                  <li>Informações de identificação: nome e e-mail (opcional)</li>
                  <li>Dados de evidências: fotos, capturas de tela e anotações</li>
                  <li>Informações de trabalho: sessões, condições climáticas e localização (cidade)</li>
                  <li>Dados financeiros: informações sobre perdas e ganhos (para cálculos)</li>
                  <li>Dados de uso: interações com o aplicativo e recursos utilizados</li>
                </ul>
              </section>

              <section>
                <h3 className="text-lg font-semibold mb-3">3. Como Usamos seus Dados</h3>
                <p className="text-muted-foreground leading-relaxed mb-2">
                  Utilizamos suas informações para:
                </p>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4">
                  <li>Fornecer e melhorar nossos serviços</li>
                  <li>Gerar recursos e documentos personalizados</li>
                  <li>Calcular perdas financeiras</li>
                  <li>Produzir estatísticas anônimas e agregadas</li>
                  <li>Processar pagamentos de assinaturas</li>
                  <li>Enviar notificações importantes sobre sua conta</li>
                </ul>
              </section>

              <section>
                <h3 className="text-lg font-semibold mb-3">4. Armazenamento e Segurança</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Seus dados são armazenados de forma segura na blockchain Internet Computer, uma rede
                  descentralizada que oferece alto nível de segurança e privacidade. Implementamos medidas
                  técnicas e organizacionais apropriadas para proteger suas informações contra acesso não
                  autorizado, alteração, divulgação ou destruição.
                </p>
              </section>

              <section>
                <h3 className="text-lg font-semibold mb-3">5. Compartilhamento de Dados</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Não vendemos, alugamos ou compartilhamos seus dados pessoais com terceiros, exceto:
                </p>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4">
                  <li>Quando você autoriza explicitamente</li>
                  <li>Para cumprir obrigações legais</li>
                  <li>Para processar pagamentos (dados mínimos necessários)</li>
                  <li>Em forma anônima e agregada para estatísticas públicas</li>
                </ul>
              </section>

              <section>
                <h3 className="text-lg font-semibold mb-3">6. Seus Direitos</h3>
                <p className="text-muted-foreground leading-relaxed mb-2">
                  Você tem direito a:
                </p>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4">
                  <li>Acessar seus dados pessoais</li>
                  <li>Corrigir informações incorretas</li>
                  <li>Solicitar a exclusão de seus dados</li>
                  <li>Exportar seus dados em formato legível</li>
                  <li>Revogar consentimentos a qualquer momento</li>
                </ul>
              </section>

              <section>
                <h3 className="text-lg font-semibold mb-3">7. Cookies e Tecnologias Similares</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Utilizamos armazenamento local do navegador para melhorar sua experiência, como manter
                  você conectado e salvar preferências. Você pode limpar esses dados a qualquer momento
                  através das configurações do seu navegador.
                </p>
              </section>

              <section>
                <h3 className="text-lg font-semibold mb-3">8. Alterações nesta Política</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Podemos atualizar esta Política de Privacidade periodicamente. Notificaremos você sobre
                  mudanças significativas através do aplicativo ou por e-mail. O uso continuado dos serviços
                  após as alterações constitui aceitação da nova política.
                </p>
              </section>

              <section>
                <h3 className="text-lg font-semibold mb-3">9. Contato</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Para questões sobre esta Política de Privacidade ou sobre seus dados pessoais, entre em
                  contato através do aplicativo ou pelos canais de suporte disponíveis.
                </p>
              </section>
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
