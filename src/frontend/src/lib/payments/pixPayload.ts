/**
 * PIX payment payload generator following BR Code EMV specification
 * Used for PagSeguro manual PIX flow only (not for Mercado Pago)
 */

interface PixPaymentData {
  pixKey: string;
  merchantName: string;
  merchantCity: string;
  amount: number;
  txid?: string;
}

function crc16(str: string): string {
  let crc = 0xFFFF;
  for (let i = 0; i < str.length; i++) {
    crc ^= str.charCodeAt(i) << 8;
    for (let j = 0; j < 8; j++) {
      if (crc & 0x8000) {
        crc = (crc << 1) ^ 0x1021;
      } else {
        crc = crc << 1;
      }
    }
  }
  return (crc & 0xFFFF).toString(16).toUpperCase().padStart(4, '0');
}

function formatEMV(id: string, value: string): string {
  const length = value.length.toString().padStart(2, '0');
  return `${id}${length}${value}`;
}

/**
 * Create PIX payment payload for PagSeguro manual flow
 */
export function createPixPayment(amount: number, txid?: string): { payload: string; qrData: PixPaymentData } {
  const pixKey = 'contato@rotasedireitos.com.br';
  const merchantName = 'Rotas e Direitos';
  const merchantCity = 'Fortaleza';

  const merchantAccountInfo = formatEMV('00', 'BR.GOV.BCB.PIX') + formatEMV('01', pixKey);
  if (txid) {
    merchantAccountInfo.concat(formatEMV('02', txid));
  }

  let payload = '';
  payload += formatEMV('00', '01'); // Payload Format Indicator
  payload += formatEMV('26', merchantAccountInfo); // Merchant Account Information
  payload += formatEMV('52', '0000'); // Merchant Category Code
  payload += formatEMV('53', '986'); // Transaction Currency (BRL)
  payload += formatEMV('54', amount.toFixed(2)); // Transaction Amount
  payload += formatEMV('58', 'BR'); // Country Code
  payload += formatEMV('59', merchantName); // Merchant Name
  payload += formatEMV('60', merchantCity); // Merchant City
  payload += '6304'; // CRC placeholder

  const checksum = crc16(payload);
  payload += checksum;

  return {
    payload,
    qrData: {
      pixKey,
      merchantName,
      merchantCity,
      amount,
      txid,
    },
  };
}

/**
 * Generate QR code image URL for PIX payload (PagSeguro manual flow)
 */
export async function generatePixQRCode(payload: string): Promise<string> {
  const encodedPayload = encodeURIComponent(payload);
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodedPayload}`;
  return qrCodeUrl;
}
