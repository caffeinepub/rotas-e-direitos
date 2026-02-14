import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function DataPolicyPage() {
  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="space-y-2">
        <h1 className="text-4xl font-bold tracking-tight">Política de Dados</h1>
        <p className="text-muted-foreground">
          Última atualização: {new Date().toLocaleDateString('pt-BR')}
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Como Tratamos seus Dados</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[600px] pr-4">
            <div className="space-y-6 text-sm">
              <section>
                <h3 className="text-lg font-semibold mb-3">1. Princípios de Tratamento de Dados</h3>
                <p className="text-muted-foreground leading-relaxed">
                  O ROTAS E DIREITOS segue os princípios estabelecidos pela Lei Geral de Proteção de Dados
                  (LGPD - Lei nº 13.709/2018) e está comprometido com a transparência, segurança e respeito
                  aos direitos dos titulares de dados.
                </p>
              </section>

              <section>
                <h3 className="text-lg font-semibold mb-3">2. Base Legal para Tratamento</h3>
                <p className="text-muted-foreground leading-relaxed mb-2">
                  Tratamos seus dados com base nas seguintes hipóteses legais:
                </p>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4">
                  <li>Consentimento: para coleta de evidências e dados pessoais</li>
                  <li>Execução de contrato: para prestação dos serviços contratados</li>
                  <li>Legítimo interesse: para melhorias do serviço e segurança</li>
                  <li>Cumprimento de obrigação legal: quando exigido por lei</li>
                </ul>
              </section>

              <section>
                <h3 className="text-lg font-semibold mb-3">3. Categorias de Dados</h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">3.1 Dados Pessoais</h4>
                    <p className="text-muted-foreground leading-relaxed">
                      Nome, e-mail, identificador único (Principal ID da Internet Computer).
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">3.2 Dados de Trabalho</h4>
                    <p className="text-muted-foreground leading-relaxed">
                      Plataforma de trabalho, região, bairro, sessões de trabalho, condições climáticas.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">3.3 Dados Financeiros</h4>
                    <p className="text-muted-foreground leading-relaxed">
                      Ganhos diários, dias trabalhados por semana, data de desativação (para cálculos).
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">3.4 Evidências</h4>
                    <p className="text-muted-foreground leading-relaxed">
                      Fotos (selfies), capturas de tela, anotações relacionadas a desativações.
                    </p>
                  </div>
                </div>
              </section>

              <section>
                <h3 className="text-lg font-semibold mb-3">4. Finalidades do Tratamento</h3>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4">
                  <li>Organização e armazenamento de evidências para recursos administrativos</li>
                  <li>Cálculo de perdas financeiras causadas por desativações</li>
                  <li>Geração automatizada de recursos e documentos legais</li>
                  <li>Produção de estatísticas anônimas sobre desativações por região</li>
                  <li>Gestão de assinaturas e pagamentos</li>
                  <li>Comunicação com usuários sobre atualizações e suporte</li>
                  <li>Melhoria contínua dos serviços oferecidos</li>
                </ul>
              </section>

              <section>
                <h3 className="text-lg font-semibold mb-3">5. Período de Retenção</h3>
                <p className="text-muted-foreground leading-relaxed mb-2">
                  Mantemos seus dados pelo tempo necessário para:
                </p>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4">
                  <li>Prestação dos serviços contratados</li>
                  <li>Cumprimento de obrigações legais (mínimo de 5 anos para dados fiscais)</li>
                  <li>Exercício regular de direitos em processos judiciais ou administrativos</li>
                  <li>Até que você solicite a exclusão (quando aplicável)</li>
                </ul>
              </section>

              <section>
                <h3 className="text-lg font-semibold mb-3">6. Segurança da Informação</h3>
                <p className="text-muted-foreground leading-relaxed mb-2">
                  Implementamos medidas técnicas e organizacionais para proteger seus dados:
                </p>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4">
                  <li>Criptografia de dados em trânsito e em repouso</li>
                  <li>Armazenamento descentralizado na blockchain Internet Computer</li>
                  <li>Controles de acesso baseados em identidade descentralizada</li>
                  <li>Monitoramento contínuo de segurança</li>
                  <li>Backups regulares e planos de recuperação</li>
                </ul>
              </section>

              <section>
                <h3 className="text-lg font-semibold mb-3">7. Transferência Internacional de Dados</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Seus dados são armazenados na rede Internet Computer, que é distribuída globalmente.
                  Garantimos que todas as transferências internacionais atendem aos requisitos da LGPD
                  e utilizam mecanismos adequados de proteção.
                </p>
              </section>

              <section>
                <h3 className="text-lg font-semibold mb-3">8. Direitos dos Titulares</h3>
                <p className="text-muted-foreground leading-relaxed mb-2">
                  Conforme a LGPD, você tem direito a:
                </p>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4">
                  <li>Confirmação da existência de tratamento</li>
                  <li>Acesso aos dados</li>
                  <li>Correção de dados incompletos, inexatos ou desatualizados</li>
                  <li>Anonimização, bloqueio ou eliminação de dados desnecessários</li>
                  <li>Portabilidade dos dados a outro fornecedor</li>
                  <li>Eliminação dos dados tratados com consentimento</li>
                  <li>Informação sobre compartilhamento de dados</li>
                  <li>Revogação do consentimento</li>
                </ul>
              </section>

              <section>
                <h3 className="text-lg font-semibold mb-3">9. Dados Anônimos e Agregados</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Utilizamos dados anônimos e agregados para produzir estatísticas públicas sobre
                  desativações por região, plataforma e motivo. Esses dados não permitem identificação
                  individual e contribuem para a transparência sobre as condições de trabalho dos
                  entregadores.
                </p>
              </section>

              <section>
                <h3 className="text-lg font-semibold mb-3">10. Encarregado de Dados (DPO)</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Para exercer seus direitos ou esclarecer dúvidas sobre o tratamento de dados, entre
                  em contato com nosso Encarregado de Proteção de Dados através dos canais de suporte
                  disponíveis no aplicativo.
                </p>
              </section>

              <section>
                <h3 className="text-lg font-semibold mb-3">11. Incidentes de Segurança</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Em caso de incidente de segurança que possa acarretar risco ou dano relevante aos
                  titulares de dados, comunicaremos o ocorrido à Autoridade Nacional de Proteção de
                  Dados (ANPD) e aos usuários afetados, conforme determinado pela LGPD.
                </p>
              </section>
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
