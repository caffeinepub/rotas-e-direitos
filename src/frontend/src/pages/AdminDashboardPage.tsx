import { useState, useMemo } from 'react';
import { useGetAllUserAccessInfo, useBlockUser, useUnblockUser } from '../hooks/useAdmin';
import AdminGate from '../components/AdminGate';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Loader2, Search, ShieldCheck, ShieldX, Users, Lock, Unlock } from 'lucide-react';
import { UserAccessInfo, SubscriptionPlan } from '../backend';
import { Principal } from '@icp-sdk/core/principal';

function getPlanLabel(plan: SubscriptionPlan): string {
  switch (plan) {
    case SubscriptionPlan.free_24h:
      return 'Gratuito 24h';
    case SubscriptionPlan.pro_monthly:
      return 'Pro Mensal';
    case SubscriptionPlan.pro_annual:
      return 'Pro Anual';
    default:
      return 'Desconhecido';
  }
}

function getPlanBadgeVariant(plan: SubscriptionPlan): 'default' | 'secondary' | 'outline' {
  switch (plan) {
    case SubscriptionPlan.free_24h:
      return 'outline';
    case SubscriptionPlan.pro_monthly:
      return 'secondary';
    case SubscriptionPlan.pro_annual:
      return 'default';
    default:
      return 'outline';
  }
}

function formatDate(timestamp?: bigint): string {
  if (!timestamp) return 'N/A';
  const date = new Date(Number(timestamp) / 1000000);
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function isSubscriptionActive(endTime?: bigint): boolean {
  if (!endTime) return false;
  const now = Date.now() * 1000000;
  return Number(endTime) > now;
}

interface BlockDialogState {
  open: boolean;
  user: UserAccessInfo | null;
  action: 'block' | 'unblock';
}

function AdminDashboardContent() {
  const { data: users, isLoading, error } = useGetAllUserAccessInfo();
  const { mutate: blockUser, isPending: isBlocking } = useBlockUser();
  const { mutate: unblockUser, isPending: isUnblocking } = useUnblockUser();
  const [searchTerm, setSearchTerm] = useState('');
  const [dialogState, setDialogState] = useState<BlockDialogState>({
    open: false,
    user: null,
    action: 'block',
  });

  const filteredUsers = useMemo(() => {
    if (!users) return [];
    if (!searchTerm.trim()) return users;

    const term = searchTerm.toLowerCase();
    return users.filter((user) => {
      const principalStr = user.principal.toString().toLowerCase();
      const name = user.profile?.name?.toLowerCase() || '';
      const email = user.profile?.email?.toLowerCase() || '';
      return principalStr.includes(term) || name.includes(term) || email.includes(term);
    });
  }, [users, searchTerm]);

  const handleOpenDialog = (user: UserAccessInfo, action: 'block' | 'unblock') => {
    setDialogState({ open: true, user, action });
  };

  const handleConfirmAction = () => {
    if (!dialogState.user) return;

    if (dialogState.action === 'block') {
      blockUser(dialogState.user.principal);
    } else {
      unblockUser(dialogState.user.principal);
    }

    setDialogState({ open: false, user: null, action: 'block' });
  };

  const stats = useMemo(() => {
    if (!users) return { total: 0, blocked: 0, active: 0, expired: 0 };
    return {
      total: users.length,
      blocked: users.filter((u) => u.isBlockedByAdmin).length,
      active: users.filter((u) => isSubscriptionActive(u.subscriptionStatus.endTime)).length,
      expired: users.filter((u) => !isSubscriptionActive(u.subscriptionStatus.endTime)).length,
    };
  }, [users]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Carregando dados dos usuários...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="border-destructive">
        <CardHeader>
          <CardTitle className="text-destructive">Erro ao Carregar Dados</CardTitle>
          <CardDescription>
            Não foi possível carregar as informações dos usuários.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">{String(error)}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
          <ShieldCheck className="h-8 w-8 text-primary" />
          Painel Administrativo
        </h1>
        <p className="text-muted-foreground mt-2">
          Gerencie usuários, assinaturas e controle de acesso
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total de Usuários
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              <span className="text-2xl font-bold">{stats.total}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Assinaturas Ativas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-green-600" />
              <span className="text-2xl font-bold">{stats.active}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Assinaturas Expiradas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <ShieldX className="h-5 w-5 text-orange-600" />
              <span className="text-2xl font-bold">{stats.expired}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Usuários Bloqueados
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Lock className="h-5 w-5 text-destructive" />
              <span className="text-2xl font-bold">{stats.blocked}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Table */}
      <Card>
        <CardHeader>
          <CardTitle>Gerenciar Usuários</CardTitle>
          <CardDescription>
            Pesquise e gerencie o acesso dos usuários ao sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por principal, nome ou email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Desktop Table */}
            <div className="hidden md:block rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Usuário</TableHead>
                    <TableHead>Principal</TableHead>
                    <TableHead>Plano</TableHead>
                    <TableHead>Início</TableHead>
                    <TableHead>Expiração</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                        {searchTerm ? 'Nenhum usuário encontrado' : 'Nenhum usuário cadastrado'}
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredUsers.map((user) => {
                      const isActive = isSubscriptionActive(user.subscriptionStatus.endTime);
                      return (
                        <TableRow key={user.principal.toString()}>
                          <TableCell>
                            <div>
                              <div className="font-medium">
                                {user.profile?.name || 'Sem nome'}
                              </div>
                              {user.profile?.email && (
                                <div className="text-sm text-muted-foreground">
                                  {user.profile.email}
                                </div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <code className="text-xs bg-muted px-2 py-1 rounded">
                              {user.principal.toString().slice(0, 12)}...
                            </code>
                          </TableCell>
                          <TableCell>
                            <Badge variant={getPlanBadgeVariant(user.subscriptionStatus.currentPlan)}>
                              {getPlanLabel(user.subscriptionStatus.currentPlan)}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-sm">
                            {formatDate(user.subscriptionStatus.startTime)}
                          </TableCell>
                          <TableCell className="text-sm">
                            {formatDate(user.subscriptionStatus.endTime)}
                          </TableCell>
                          <TableCell>
                            {user.isBlockedByAdmin ? (
                              <Badge variant="destructive" className="gap-1">
                                <Lock className="h-3 w-3" />
                                Bloqueado
                              </Badge>
                            ) : isActive ? (
                              <Badge variant="default" className="gap-1 bg-green-600">
                                <ShieldCheck className="h-3 w-3" />
                                Ativo
                              </Badge>
                            ) : (
                              <Badge variant="secondary" className="gap-1">
                                <ShieldX className="h-3 w-3" />
                                Expirado
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell className="text-right">
                            {user.isBlockedByAdmin ? (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleOpenDialog(user, 'unblock')}
                                disabled={isUnblocking}
                              >
                                <Unlock className="h-4 w-4 mr-1" />
                                Desbloquear
                              </Button>
                            ) : (
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => handleOpenDialog(user, 'block')}
                                disabled={isBlocking}
                              >
                                <Lock className="h-4 w-4 mr-1" />
                                Bloquear
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden space-y-4">
              {filteredUsers.length === 0 ? (
                <div className="text-center text-muted-foreground py-8">
                  {searchTerm ? 'Nenhum usuário encontrado' : 'Nenhum usuário cadastrado'}
                </div>
              ) : (
                filteredUsers.map((user) => {
                  const isActive = isSubscriptionActive(user.subscriptionStatus.endTime);
                  return (
                    <Card key={user.principal.toString()}>
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle className="text-base">
                              {user.profile?.name || 'Sem nome'}
                            </CardTitle>
                            {user.profile?.email && (
                              <CardDescription className="text-sm mt-1">
                                {user.profile.email}
                              </CardDescription>
                            )}
                          </div>
                          {user.isBlockedByAdmin ? (
                            <Badge variant="destructive" className="gap-1">
                              <Lock className="h-3 w-3" />
                              Bloqueado
                            </Badge>
                          ) : isActive ? (
                            <Badge variant="default" className="gap-1 bg-green-600">
                              <ShieldCheck className="h-3 w-3" />
                              Ativo
                            </Badge>
                          ) : (
                            <Badge variant="secondary" className="gap-1">
                              <ShieldX className="h-3 w-3" />
                              Expirado
                            </Badge>
                          )}
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Principal:</span>
                            <code className="text-xs bg-muted px-2 py-1 rounded">
                              {user.principal.toString().slice(0, 12)}...
                            </code>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Plano:</span>
                            <Badge variant={getPlanBadgeVariant(user.subscriptionStatus.currentPlan)}>
                              {getPlanLabel(user.subscriptionStatus.currentPlan)}
                            </Badge>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Início:</span>
                            <span>{formatDate(user.subscriptionStatus.startTime)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Expiração:</span>
                            <span>{formatDate(user.subscriptionStatus.endTime)}</span>
                          </div>
                        </div>
                        <div className="pt-2">
                          {user.isBlockedByAdmin ? (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleOpenDialog(user, 'unblock')}
                              disabled={isUnblocking}
                              className="w-full"
                            >
                              <Unlock className="h-4 w-4 mr-2" />
                              Desbloquear Usuário
                            </Button>
                          ) : (
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleOpenDialog(user, 'block')}
                              disabled={isBlocking}
                              className="w-full"
                            >
                              <Lock className="h-4 w-4 mr-2" />
                              Bloquear Usuário
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Confirmation Dialog */}
      <AlertDialog open={dialogState.open} onOpenChange={(open) => setDialogState({ ...dialogState, open })}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {dialogState.action === 'block' ? 'Bloquear Usuário?' : 'Desbloquear Usuário?'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {dialogState.action === 'block' ? (
                <>
                  Você está prestes a bloquear o acesso de{' '}
                  <strong>{dialogState.user?.profile?.name || 'este usuário'}</strong>.
                  <br />
                  <br />
                  O usuário não poderá mais acessar funcionalidades protegidas do sistema até ser desbloqueado.
                </>
              ) : (
                <>
                  Você está prestes a desbloquear o acesso de{' '}
                  <strong>{dialogState.user?.profile?.name || 'este usuário'}</strong>.
                  <br />
                  <br />
                  O usuário poderá voltar a acessar o sistema normalmente.
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmAction}
              className={dialogState.action === 'block' ? 'bg-destructive hover:bg-destructive/90' : ''}
            >
              {isBlocking || isUnblocking ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processando...
                </>
              ) : dialogState.action === 'block' ? (
                'Bloquear'
              ) : (
                'Desbloquear'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export default function AdminDashboardPage() {
  return (
    <AdminGate>
      <AdminDashboardContent />
    </AdminGate>
  );
}
