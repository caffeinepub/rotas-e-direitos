import { PublicLossProfile } from '../backend';
import { calculateLosses } from './lossCalculations';

export async function generateLossPDF(
  profile: PublicLossProfile,
  returnBlob: boolean = false
): Promise<Blob | null> {
  const losses = calculateLosses(profile);

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

  const deactivationDate = new Date(Number(profile.deactivationDate) / 1000000);
  const today = new Date();

  const content = `
RELATÓRIO DE PERDAS FINANCEIRAS
================================

Entregador #${Math.random().toString(36).substring(2, 10).toUpperCase()}

Período: ${deactivationDate.toLocaleDateString('pt-BR')} até ${today.toLocaleDateString('pt-BR')}

VALORES CALCULADOS
------------------

Perda Semanal: ${formatCurrency(losses.weekly)}
Perda Mensal: ${formatCurrency(losses.monthly)}
Perda Acumulada (${losses.daysSince} dias): ${formatCurrency(losses.accumulated)}

PROJEÇÕES
---------

30 dias: ${formatCurrency(losses.projection30)}
60 dias: ${formatCurrency(losses.projection60)}
90 dias: ${formatCurrency(losses.projection90)}

---

Este documento serve como estimativa de danos materiais causados pela desativação.

Documento gerado em ${today.toLocaleDateString('pt-BR')}
`;

  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });

  if (returnBlob) {
    return blob;
  } else {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `relatorio-perdas-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    return null;
  }
}
