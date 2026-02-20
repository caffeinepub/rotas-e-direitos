/**
 * PIX Payment Payload Generator
 * Generates valid PIX EMV QR code payloads following BR Code specification
 * Reference: https://www.bcb.gov.br/content/config/Documents/BR_Code_MANUAL_Version_2_May_2020.pdf
 */

interface PixPayloadOptions {
  pixKey: string;
  merchantName?: string;
  merchantCity?: string;
  transactionAmount?: number;
  description?: string;
}

/**
 * Calculates CRC16-CCITT-FALSE checksum for PIX payload
 */
function calculateCRC16(payload: string): string {
  const polynomial = 0x1021;
  let crc = 0xffff;

  const bytes = new TextEncoder().encode(payload);

  for (let i = 0; i < bytes.length; i++) {
    crc ^= bytes[i] << 8;
    for (let j = 0; j < 8; j++) {
      if ((crc & 0x8000) !== 0) {
        crc = (crc << 1) ^ polynomial;
      } else {
        crc = crc << 1;
      }
    }
  }

  crc = crc & 0xffff;
  return crc.toString(16).toUpperCase().padStart(4, '0');
}

/**
 * Formats a TLV (Tag-Length-Value) field
 */
function formatTLV(tag: string, value: string): string {
  const length = value.length.toString().padStart(2, '0');
  return `${tag}${length}${value}`;
}

/**
 * Generates a PIX static QR code payload (BR Code)
 */
export function generatePixPayload(options: PixPayloadOptions): string {
  const {
    pixKey,
    merchantName = 'Rotas e Direitos',
    merchantCity = 'Fortaleza',
    transactionAmount,
    description,
  } = options;

  // Build Merchant Account Information (tag 26) - PIX
  let merchantAccountInfo = formatTLV('00', 'BR.GOV.BCB.PIX'); // GUI
  merchantAccountInfo += formatTLV('01', pixKey); // PIX Key

  // Build Additional Data Field (tag 62) if description provided
  let additionalData = '';
  if (description) {
    additionalData = formatTLV('05', description); // Reference Label
  }

  // Build the payload without CRC
  let payload = '';
  payload += formatTLV('00', '01'); // Payload Format Indicator
  payload += formatTLV('26', merchantAccountInfo); // Merchant Account Information
  payload += formatTLV('52', '0000'); // Merchant Category Code
  payload += formatTLV('53', '986'); // Transaction Currency (986 = BRL)

  // Add transaction amount if provided
  if (transactionAmount && transactionAmount > 0) {
    const amountStr = transactionAmount.toFixed(2);
    payload += formatTLV('54', amountStr);
  }

  payload += formatTLV('58', 'BR'); // Country Code
  payload += formatTLV('59', merchantName); // Merchant Name
  payload += formatTLV('60', merchantCity); // Merchant City

  // Add additional data if present
  if (additionalData) {
    payload += formatTLV('62', additionalData);
  }

  // Add CRC placeholder
  payload += '6304';

  // Calculate and append CRC
  const crc = calculateCRC16(payload);
  payload += crc;

  return payload;
}

/**
 * Generates a fixed PIX QR code for the application
 * Uses the configured PIX key email
 */
export function generateFixedPixPayload(): string {
  return generatePixPayload({
    pixKey: 'proj.defdriver+pagbank@gmail.com',
    merchantName: 'Rotas e Direitos',
    merchantCity: 'Fortaleza',
  });
}
