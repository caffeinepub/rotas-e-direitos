import { PublicLossProfile } from '../types/backend-extended';
import { calculateWeeklyLoss, calculateMonthlyLoss, calculateAccumulatedLoss, calculateProjectedLoss } from './lossCalculations';

// Load jsPDF from CDN
let jsPDFLoaded = false;
let jsPDFLoadPromise: Promise<void> | null = null;

function loadJsPDF(): Promise<void> {
  if (jsPDFLoaded) return Promise.resolve();
  if (jsPDFLoadPromise) return jsPDFLoadPromise;

  jsPDFLoadPromise = new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/jspdf@2.5.1/dist/jspdf.umd.min.js';
    script.onload = () => {
      jsPDFLoaded = true;
      resolve();
    };
    script.onerror = () => reject(new Error('Failed to load jsPDF library'));
    document.head.appendChild(script);
  });

  return jsPDFLoadPromise;
}

function getPlatformName(platform: string): string {
  const platformNames: Record<string, string> = {
    ifood: 'iFood',
    uber: 'Uber',
    rappi: 'Rappi',
    ninetyNine: '99',
  };
  return platformNames[platform] || platform;
}

export async function generateLossReportPDF(profile: PublicLossProfile): Promise<Blob> {
  await loadJsPDF();

  // @ts-ignore - jsPDF is loaded from CDN
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  const weeklyLoss = calculateWeeklyLoss(profile);
  const monthlyLoss = calculateMonthlyLoss(profile);
  const accumulatedLoss = calculateAccumulatedLoss(profile);
  const deactivationDate = new Date(Number(profile.deactivationDate));

  // Header
  doc.setFontSize(20);
  doc.setTextColor(40, 40, 40);
  doc.text('RELATÓRIO DE PERDAS FINANCEIRAS', 105, 20, { align: 'center' });

  // Subtitle
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text('Calculadora de Prejuízos - Rotas e Direitos', 105, 28, { align: 'center' });

  // Line separator
  doc.setDrawColor(200, 200, 200);
  doc.line(20, 32, 190, 32);

  // Profile Information Section
  doc.setFontSize(14);
  doc.setTextColor(40, 40, 40);
  doc.text('Informações do Perfil', 20, 42);

  doc.setFontSize(11);
  doc.setTextColor(60, 60, 60);
  let yPos = 52;

  doc.text(`Plataforma: ${getPlatformName(profile.platform)}`, 25, yPos);
  yPos += 8;
  doc.text(`Data da Desativação: ${deactivationDate.toLocaleDateString('pt-BR')}`, 25, yPos);
  yPos += 8;
  doc.text(`Ganho Médio Diário: R$ ${profile.dailyEarnings.toFixed(2)}`, 25, yPos);
  yPos += 8;
  doc.text(`Dias Trabalhados por Semana: ${profile.daysPerWeek}`, 25, yPos);
  yPos += 8;

  const daysSinceDeactivation = Math.max(0, Math.floor((Date.now() - Number(profile.deactivationDate)) / (1000 * 60 * 60 * 24)));
  doc.text(`Dias Desde a Desativação: ${daysSinceDeactivation}`, 25, yPos);

  // Line separator
  yPos += 10;
  doc.setDrawColor(200, 200, 200);
  doc.line(20, yPos, 190, yPos);

  // Calculated Losses Section
  yPos += 10;
  doc.setFontSize(14);
  doc.setTextColor(40, 40, 40);
  doc.text('Perdas Calculadas', 20, yPos);

  yPos += 10;
  doc.setFontSize(11);
  doc.setTextColor(60, 60, 60);

  // Weekly Loss Box
  doc.setFillColor(240, 248, 255);
  doc.rect(20, yPos, 170, 20, 'F');
  doc.setTextColor(40, 40, 40);
  doc.text('Perda Semanal', 25, yPos + 7);
  doc.setFontSize(16);
  doc.setTextColor(220, 38, 38);
  doc.text(`R$ ${weeklyLoss.toFixed(2)}`, 25, yPos + 15);
  yPos += 25;

  // Monthly Loss Box
  doc.setFontSize(11);
  doc.setFillColor(255, 247, 237);
  doc.rect(20, yPos, 170, 20, 'F');
  doc.setTextColor(40, 40, 40);
  doc.text('Perda Mensal', 25, yPos + 7);
  doc.setFontSize(16);
  doc.setTextColor(220, 38, 38);
  doc.text(`R$ ${monthlyLoss.toFixed(2)}`, 25, yPos + 15);
  yPos += 25;

  // Accumulated Loss Box
  doc.setFontSize(11);
  doc.setFillColor(254, 242, 242);
  doc.rect(20, yPos, 170, 20, 'F');
  doc.setTextColor(40, 40, 40);
  doc.text('Perda Acumulada Total', 25, yPos + 7);
  doc.setFontSize(16);
  doc.setTextColor(220, 38, 38);
  doc.text(`R$ ${accumulatedLoss.toFixed(2)}`, 25, yPos + 15);
  yPos += 30;

  // Line separator
  doc.setDrawColor(200, 200, 200);
  doc.line(20, yPos, 190, yPos);

  // Projection Section
  yPos += 10;
  doc.setFontSize(14);
  doc.setTextColor(40, 40, 40);
  doc.text('Projeção de Perdas (90 dias)', 20, yPos);

  yPos += 10;
  doc.setFontSize(10);
  doc.setTextColor(60, 60, 60);

  // Projection table
  const projectionDays = [30, 60, 90];
  projectionDays.forEach((days) => {
    const projectedLoss = calculateProjectedLoss(profile, days);
    doc.text(`${days} dias: R$ ${projectedLoss.toFixed(2)}`, 25, yPos);
    yPos += 7;
  });

  // Footer
  yPos = 270;
  doc.setDrawColor(200, 200, 200);
  doc.line(20, yPos, 190, yPos);
  yPos += 8;
  doc.setFontSize(9);
  doc.setTextColor(120, 120, 120);
  doc.text(`Relatório gerado em: ${new Date().toLocaleString('pt-BR')}`, 105, yPos, { align: 'center' });
  yPos += 6;
  doc.text('Rotas e Direitos - Plataforma de Apoio para Trabalhadores de Aplicativos', 105, yPos, { align: 'center' });

  return doc.output('blob');
}
