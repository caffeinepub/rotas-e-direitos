import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, Settings, TrendingUp, Loader2, Save, AlertCircle, CheckCircle2, Ban, Unlock, ShieldAlert, Info, MessageSquare } from 'lucide-react';
import { useGetAllUserAccessInfo, useBlockUser, useUnblockUser } from '../hooks/useAdmin';
import { useUpdatePaymentConfig } from '../hooks/useAdminPaymentConfig';
import { usePublicPaymentConfig } from '../hooks/usePublicPaymentConfig';
import { PaymentConfig } from '../backend';
import { toast } from 'sonner';
import { Principal } from '@dfinity/principal';
import AdminTestimonialsModerationPanel from '../components/admin/AdminTestimonialsModerationPanel';
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
  });
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Update local config when public config loads
  useEffect(() => {
    if (publicConfig?.gatewayProvider) {
      setLocalConfig(prev => ({
        ...prev,
        gatewayProvider: {
          enabled: publicConfig.gatewayProvider.enabled,
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
            <Card>
              <CardHeader>
                <CardTitle>Configuração do Gateway de Pagamento</CardTitle>
                <CardDescription>Configure as definições do provedor de pagamento</CardDescription>
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

                      <Separator />

                      {saveSuccess && (
                        <Alert>
                          <CheckCircle2 className="h-4 w-4" />
                          <AlertDescription>
                            Configuração salva com sucesso
                          </AlertDescription>
                        </Alert>
                      )}

                      {updateConfig.isError && (
                        <Alert variant="destructive">
                          <AlertCircle className="h-4 w-4" />
                          <AlertDescription>
                            Falha ao salvar configuração. Por favor, tente novamente.
                          </AlertDescription>
                        </Alert>
                      )}

                      <Button
                        onClick={handleSaveConfig}
                        disabled={isSaving}
                        className="w-full"
                      >
                        {isSaving ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Salvando...
                          </>
                        ) : (
                          <>
                            <Save className="h-4 w-4 mr-2" />
                            Salvar Configuração
                          </>
                        )}
                      </Button>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminGate>
  );
}
