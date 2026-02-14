import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
import MercadoPagoSetupGuide from '../components/admin/MercadoPagoSetupGuide';
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
    mercadoPago: {
      accessToken: '',
      publicKey: '',
      enabled: false,
    },
  });
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Update local config when public config loads (only non-sensitive fields)
  useEffect(() => {
    if (publicConfig?.mercadoPago) {
      setLocalConfig(prev => ({
        ...prev,
        mercadoPago: {
          ...prev.mercadoPago,
          publicKey: publicConfig.mercadoPago.publicKey,
          enabled: publicConfig.mercadoPago.enabled,
          // Keep accessToken from local state (not available from backend)
        },
      }));
    }
  }, [publicConfig]);

  const validatePublicKey = (key: string): boolean => {
    if (!key.trim()) return false;
    // Accept keys starting with TEST- or APP_USR- (case insensitive)
    const upperKey = key.toUpperCase();
    return upperKey.startsWith('TEST-') || upperKey.startsWith('APP_USR-');
  };

  const handleSaveConfig = async () => {
    if (!localConfig) return;

    // Validation: Check if Mercado Pago is being enabled
    if (localConfig.mercadoPago.enabled) {
      if (!localConfig.mercadoPago.publicKey.trim()) {
        toast.error('Public Key is required when Mercado Pago is enabled');
        return;
      }

      if (!validatePublicKey(localConfig.mercadoPago.publicKey)) {
        toast.error('Public Key must start with TEST- or APP_USR-');
        return;
      }

      if (!localConfig.mercadoPago.accessToken.trim()) {
        toast.error('Access Token is required when Mercado Pago is enabled');
        return;
      }
    }

    setIsSaving(true);
    setSaveSuccess(false);

    try {
      await updateConfig.mutateAsync(localConfig);
      
      // Explicitly refetch public config to update UI with saved state
      await refetchPublicConfig();
      
      setSaveSuccess(true);
      toast.success('Payment configuration saved successfully');
      
      // Clear Access Token field for security (don't keep it in local state)
      setLocalConfig(prev => ({
        ...prev,
        mercadoPago: {
          ...prev.mercadoPago,
          accessToken: '',
        },
      }));

      // Clear success message after 3 seconds
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error: any) {
      console.error('Save config error:', error);
      toast.error(error.message || 'Failed to save payment configuration');
    } finally {
      setIsSaving(false);
    }
  };

  const handleBlockUser = async (principal: Principal) => {
    try {
      await blockUser.mutateAsync(principal);
      toast.success('User blocked successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to block user');
    }
  };

  const handleUnblockUser = async (principal: Principal) => {
    try {
      await unblockUser.mutateAsync(principal);
      toast.success('User unblocked successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to unblock user');
    }
  };

  const totalUsers = users?.length || 0;
  const blockedUsers = users?.filter(u => u.isBlockedByAdmin).length || 0;
  const proUsers = users?.filter(u => u.subscriptionStatus.currentPlan !== 'free_24h').length || 0;

  return (
    <AdminGate>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage users and system configuration</p>
        </div>

        {/* Statistics Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalUsers}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pro Subscribers</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{proUsers}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Blocked Users</CardTitle>
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
              Users
            </TabsTrigger>
            <TabsTrigger value="testimonials">
              <MessageSquare className="h-4 w-4 mr-2" />
              Testimonials
            </TabsTrigger>
            <TabsTrigger value="payments">
              <Settings className="h-4 w-4 mr-2" />
              Payment Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="users" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
                <CardDescription>View and manage all registered users</CardDescription>
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
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Plan</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {users.map((user) => (
                        <TableRow key={user.principal.toString()}>
                          <TableCell className="font-medium">
                            {user.profile?.name || 'No name'}
                          </TableCell>
                          <TableCell>{user.profile?.email || 'No email'}</TableCell>
                          <TableCell>
                            <Badge variant={user.subscriptionStatus.currentPlan === 'free_24h' ? 'outline' : 'default'}>
                              {user.subscriptionStatus.currentPlan.replace('_', ' ')}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {user.isBlockedByAdmin ? (
                              <Badge variant="destructive">Blocked</Badge>
                            ) : (
                              <Badge variant="outline" className="border-green-600 text-green-600">Active</Badge>
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
                                Unblock
                              </Button>
                            ) : (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleBlockUser(user.principal)}
                                disabled={blockUser.isPending}
                              >
                                <Ban className="h-4 w-4 mr-1" />
                                Block
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    No users found
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="testimonials" className="space-y-4">
            <AdminTestimonialsModerationPanel />
          </TabsContent>

          <TabsContent value="payments" className="space-y-4">
            <MercadoPagoSetupGuide />

            <Card>
              <CardHeader>
                <CardTitle>Mercado Pago Configuration</CardTitle>
                <CardDescription>
                  Configure your Mercado Pago payment integration
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {configLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                  </div>
                ) : (
                  <>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="mp-enabled">Enable Mercado Pago</Label>
                          <p className="text-sm text-muted-foreground">
                            Allow users to pay via Mercado Pago
                          </p>
                        </div>
                        <Switch
                          id="mp-enabled"
                          checked={localConfig.mercadoPago.enabled}
                          onCheckedChange={(checked) =>
                            setLocalConfig({
                              ...localConfig,
                              mercadoPago: { ...localConfig.mercadoPago, enabled: checked },
                            })
                          }
                        />
                      </div>

                      <Separator />

                      <div className="space-y-2">
                        <Label htmlFor="mp-public-key">Public Key</Label>
                        <Input
                          id="mp-public-key"
                          type="text"
                          placeholder="TEST-... or APP_USR-..."
                          value={localConfig.mercadoPago.publicKey}
                          onChange={(e) =>
                            setLocalConfig({
                              ...localConfig,
                              mercadoPago: { ...localConfig.mercadoPago, publicKey: e.target.value },
                            })
                          }
                        />
                        <p className="text-xs text-muted-foreground">
                          Your Mercado Pago Public Key (starts with TEST- or APP_USR-)
                        </p>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="mp-access-token">Access Token</Label>
                        <Input
                          id="mp-access-token"
                          type="password"
                          placeholder="Enter your Access Token"
                          value={localConfig.mercadoPago.accessToken}
                          onChange={(e) =>
                            setLocalConfig({
                              ...localConfig,
                              mercadoPago: { ...localConfig.mercadoPago, accessToken: e.target.value },
                            })
                          }
                        />
                        <Alert>
                          <Info className="h-4 w-4" />
                          <AlertDescription className="text-xs">
                            For security, the Access Token is never displayed after saving. Enter it again only when updating.
                          </AlertDescription>
                        </Alert>
                      </div>
                    </div>

                    {saveSuccess && (
                      <Alert className="border-green-600 bg-green-50 dark:bg-green-950">
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                        <AlertDescription className="text-green-800 dark:text-green-200">
                          Configuration saved successfully
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
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="h-4 w-4 mr-2" />
                          Save Configuration
                        </>
                      )}
                    </Button>
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
