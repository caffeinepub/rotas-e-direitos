import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Users, Settings, TrendingUp, Loader2, Save, AlertCircle, CheckCircle2, Ban, Unlock, ShieldAlert, Info, MessageSquare, ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';
import { useGetAllUserAccessInfo, useBlockUser, useUnblockUser } from '../hooks/useAdmin';
import { useUpdatePaymentConfig } from '../hooks/useAdminPaymentConfig';
import { usePublicPaymentConfig } from '../hooks/usePublicPaymentConfig';
import { PaymentConfig } from '../backend';
import { toast } from 'sonner';
import { Principal } from '@dfinity/principal';
import AdminTestimonialsModerationPanel from '../components/admin/AdminTestimonialsModerationPanel';
import PagBankSetupGuide from '../components/payments/PagBankSetupGuide';
import PagBankTransparentCheckoutForm from '../components/admin/PagBankTransparentCheckoutForm';
import AdminGate from '../components/AdminGate';

export default function AdminDashboardPage() {
  const { data: users, isLoading: usersLoading } = useGetAllUserAccessInfo();
  const { data: publicConfig, isLoading: configLoading, refetch: refetchPublicConfig } = usePublicPaymentConfig();
  const updateConfig = useUpdatePaymentConfig();
  const blockUser = useBlockUser();
  const unblockUser = useUnblockUser();

  // Initialize with default empty config
  const [localConfig, setLocalConfig] = useState<PaymentConfig>({
    gatewayProvider: {
      enabled: false,
    },
    pagbankProvider: {
      enabled: false,
      clientId: undefined,
      clientSecret: undefined,
      merchantId: undefined,
      webhookSecret: undefined,
    },
  });
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [showPagBankGuide, setShowPagBankGuide] = useState(false);

  // Update local config when public config loads
  useEffect(() => {
    if (publicConfig) {
      setLocalConfig(prev => ({
        ...prev,
        gatewayProvider: {
          enabled: publicConfig.gatewayProvider.enabled,
        },
        pagbankProvider: {
          ...prev.pagbankProvider,
          enabled: publicConfig.pagbankProvider.enabled,
        },
      }));
    }
  }, [publicConfig]);

  const handleSaveConfig = async () => {
    if (!localConfig) return;

    setIsSaving(true);
    setSaveSuccess(false);

    try {
      await updateConfig.mutateAsync(localConfig);
      
      // Explicitly refetch public config to update UI with saved state
      await refetchPublicConfig();
      
      setSaveSuccess(true);
      toast.success('Configuração de pagamento salva com sucesso');

      // Clear success message after 3 seconds
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error: any) {
      console.error('Save config error:', error);
      toast.error(error.message || 'Falha ao salvar configuração de pagamento');
    } finally {
      setIsSaving(false);
    }
  };

  const handleBlockUser = async (principal: Principal) => {
    try {
      await blockUser.mutateAsync(principal);
      toast.success('Usuário bloqueado com sucesso');
    } catch (error: any) {
      toast.error(error.message || 'Falha ao bloquear usuário');
    }
  };

  const handleUnblockUser = async (principal: Principal) => {
    try {
      await unblockUser.mutateAsync(principal);
      toast.success('Usuário desbloqueado com sucesso');
    } catch (error: any) {
      toast.error(error.message || 'Falha ao desbloquear usuário');
    }
  };

  const totalUsers = users?.length || 0;
  const blockedUsers = users?.filter(u => u.isBlockedByAdmin).length || 0;
  const proUsers = users?.filter(u => u.subscriptionStatus.currentPlan !== 'free_24h').length || 0;

  return (
    <AdminGate>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Painel Administrativo</h1>
          <p className="text-muted-foreground">Gerencie usuários e configurações do sistema</p>
        </div>

        {/* Statistics Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Usuários</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalUsers}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Assinantes Pro</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{proUsers}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Usuários Bloqueados</CardTitle>
              <ShieldAlert className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{blockedUsers}</div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="users" className="space-y-4">
          <TabsList>
            <TabsTrigger value="users">
              <Users className="h-4 w-4 mr-2" />
              Usuários
            </TabsTrigger>
            <TabsTrigger value="testimonials">
              <MessageSquare className="h-4 w-4 mr-2" />
              Depoimentos
            </TabsTrigger>
            <TabsTrigger value="payments">
              <Settings className="h-4 w-4 mr-2" />
              Configurações de Pagamento
            </TabsTrigger>
          </TabsList>

          <TabsContent value="users" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Gerenciamento de Usuários</CardTitle>
                <CardDescription>Visualize e gerencie todos os usuários registrados</CardDescription>
              </CardHeader>
              <CardContent>
                {usersLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                  </div>
                ) : users && users.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nome</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Plano</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {users.map((user) => (
                        <TableRow key={user.principal.toString()}>
                          <TableCell className="font-medium">
                            {user.profile?.name || 'Sem nome'}
                          </TableCell>
                          <TableCell>{user.profile?.email || 'Sem email'}</TableCell>
                          <TableCell>
                            <Badge variant={user.subscriptionStatus.currentPlan === 'free_24h' ? 'outline' : 'default'}>
                              {user.subscriptionStatus.currentPlan}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {user.isBlockedByAdmin ? (
                              <Badge variant="destructive">Bloqueado</Badge>
                            ) : (
                              <Badge variant="outline" className="border-green-600 text-green-600">Ativo</Badge>
                            )}
                          </TableCell>
                          <TableCell>
                            {user.isBlockedByAdmin ? (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleUnblockUser(user.principal)}
                                disabled={unblockUser.isPending}
                              >
                                <Unlock className="h-4 w-4 mr-1" />
                                Desbloquear
                              </Button>
                            ) : (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleBlockUser(user.principal)}
                                disabled={blockUser.isPending}
                              >
                                <Ban className="h-4 w-4 mr-1" />
                                Bloquear
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    Nenhum usuário encontrado
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="testimonials" className="space-y-4">
            <AdminTestimonialsModerationPanel />
          </TabsContent>

          <TabsContent value="payments" className="space-y-4">
            {/* Gateway Provider Configuration */}
            <Card>
              <CardHeader>
                <CardTitle>Configuração do Gateway de Pagamento</CardTitle>
                <CardDescription>Configure as definições do provedor de pagamento genérico</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {configLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                  </div>
                ) : (
                  <>
                    <Alert>
                      <Info className="h-4 w-4" />
                      <AlertDescription>
                        A integração do gateway de pagamento está sendo preparada. Habilite o gateway quando as credenciais do provedor de pagamento estiverem configuradas.
                      </AlertDescription>
                    </Alert>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <div className="text-sm font-medium">Habilitar Gateway de Pagamento</div>
                          <div className="text-sm text-muted-foreground">
                            Ative ou desative o processamento de pagamentos
                          </div>
                        </div>
                        <Switch
                          checked={localConfig.gatewayProvider.enabled}
                          onCheckedChange={(checked) =>
                            setLocalConfig({
                              ...localConfig,
                              gatewayProvider: { enabled: checked },
                            })
                          }
                        />
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {/* PagBank Provider Configuration */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Configuração do PagBank</CardTitle>
                    <CardDescription>Configure as credenciais e definições do PagBank</CardDescription>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowPagBankGuide(!showPagBankGuide)}
                  >
                    <HelpCircle className="h-4 w-4 mr-2" />
                    {showPagBankGuide ? 'Ocultar Guia' : 'Ver Guia'}
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {configLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                  </div>
                ) : (
                  <>
                    {showPagBankGuide && (
                      <div className="mb-6">
                        <PagBankSetupGuide />
                      </div>
                    )}

                    <Alert>
                      <Info className="h-4 w-4" />
                      <AlertDescription>
                        Configure suas credenciais do PagBank para processar pagamentos. Todas as credenciais são obrigatórias quando o PagBank está habilitado.
                      </AlertDescription>
                    </Alert>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <div className="text-sm font-medium">Habilitar PagBank</div>
                          <div className="text-sm text-muted-foreground">
                            Ative ou desative o processamento de pagamentos via PagBank
                          </div>
                        </div>
                        <Switch
                          checked={localConfig.pagbankProvider.enabled}
                          onCheckedChange={(checked) =>
                            setLocalConfig({
                              ...localConfig,
                              pagbankProvider: {
                                ...localConfig.pagbankProvider,
                                enabled: checked,
                              },
                            })
                          }
                        />
                      </div>

                      <Separator />

                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="pagbank-client-id">Client ID</Label>
                          <Input
                            id="pagbank-client-id"
                            type="text"
                            placeholder="Digite o Client ID do PagBank"
                            value={localConfig.pagbankProvider.clientId || ''}
                            onChange={(e) =>
                              setLocalConfig({
                                ...localConfig,
                                pagbankProvider: {
                                  ...localConfig.pagbankProvider,
                                  clientId: e.target.value || undefined,
                                },
                              })
                            }
                            disabled={!localConfig.pagbankProvider.enabled}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="pagbank-client-secret">Client Secret</Label>
                          <Input
                            id="pagbank-client-secret"
                            type="password"
                            placeholder="Digite o Client Secret do PagBank"
                            value={localConfig.pagbankProvider.clientSecret || ''}
                            onChange={(e) =>
                              setLocalConfig({
                                ...localConfig,
                                pagbankProvider: {
                                  ...localConfig.pagbankProvider,
                                  clientSecret: e.target.value || undefined,
                                },
                              })
                            }
                            disabled={!localConfig.pagbankProvider.enabled}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="pagbank-merchant-id">Merchant ID</Label>
                          <Input
                            id="pagbank-merchant-id"
                            type="text"
                            placeholder="Digite o Merchant ID do PagBank"
                            value={localConfig.pagbankProvider.merchantId || ''}
                            onChange={(e) =>
                              setLocalConfig({
                                ...localConfig,
                                pagbankProvider: {
                                  ...localConfig.pagbankProvider,
                                  merchantId: e.target.value || undefined,
                                },
                              })
                            }
                            disabled={!localConfig.pagbankProvider.enabled}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="pagbank-webhook-secret">Webhook Secret</Label>
                          <Input
                            id="pagbank-webhook-secret"
                            type="password"
                            placeholder="Digite o Webhook Secret do PagBank"
                            value={localConfig.pagbankProvider.webhookSecret || ''}
                            onChange={(e) =>
                              setLocalConfig({
                                ...localConfig,
                                pagbankProvider: {
                                  ...localConfig.pagbankProvider,
                                  webhookSecret: e.target.value || undefined,
                                },
                              })
                            }
                            disabled={!localConfig.pagbankProvider.enabled}
                          />
                        </div>
                      </div>

                      <div className="flex items-center gap-3 pt-4">
                        <Button onClick={handleSaveConfig} disabled={isSaving} className="min-w-[120px]">
                          {isSaving ? (
                            <>
                              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                              Salvando...
                            </>
                          ) : (
                            <>
                              <Save className="h-4 w-4 mr-2" />
                              Salvar
                            </>
                          )}
                        </Button>

                        {saveSuccess && (
                          <div className="flex items-center text-sm text-green-600">
                            <CheckCircle2 className="h-4 w-4 mr-2" />
                            Salvo com sucesso
                          </div>
                        )}
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {/* PagBank Transparent Checkout Configuration */}
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="transparent-checkout">
                <AccordionTrigger className="text-lg font-semibold">
                  Configuração do Checkout Transparente PagBank
                </AccordionTrigger>
                <AccordionContent>
                  <div className="pt-4">
                    <PagBankTransparentCheckoutForm />
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </TabsContent>
        </Tabs>
      </div>
    </AdminGate>
  );
}
