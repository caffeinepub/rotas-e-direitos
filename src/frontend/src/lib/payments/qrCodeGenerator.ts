/**
 * QR Code generator using qrcode library via CDN
 * Generates QR codes client-side without npm dependencies
 */

// Load qrcode library dynamically if not already loaded
let qrCodeLibLoaded = false;
let qrCodeLibPromise: Promise<void> | null = null;

function loadQRCodeLibrary(): Promise<void> {
  if (qrCodeLibLoaded) {
    return Promise.resolve();
  }

  if (qrCodeLibPromise) {
    return qrCodeLibPromise;
  }

  qrCodeLibPromise = new Promise((resolve, reject) => {
    // Check if already loaded
    if (typeof (window as any).QRCode !== 'undefined') {
      qrCodeLibLoaded = true;
      resolve();
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/qrcode@1.5.3/build/qrcode.min.js';
    script.async = true;
    script.onload = () => {
      qrCodeLibLoaded = true;
      resolve();
    };
    script.onerror = () => {
      qrCodeLibPromise = null;
      reject(new Error('Failed to load QR code library from CDN'));
    };
    document.head.appendChild(script);
  });

  return qrCodeLibPromise;
}

/**
 * Generates a QR code as a data URL from the given text
 * @param text - The text to encode in the QR code
 * @param size - The size of the QR code in pixels (default: 300)
 * @returns Promise that resolves to a data URL string
 */
export async function generateQRCodeDataURL(text: string, size: number = 300): Promise<string> {
  if (!text || text.trim().length === 0) {
    throw new Error('Text cannot be empty');
  }

  try {
    // Load the QR code library
    await loadQRCodeLibrary();

    const QRCode = (window as any).QRCode;
    
    if (!QRCode || !QRCode.toDataURL) {
      throw new Error('QR Code library not properly loaded');
    }

    // Generate QR code using the library's toDataURL method
    const dataUrl = await QRCode.toDataURL(text, {
      width: size,
      margin: 1,
      color: {
        dark: '#000000',
        light: '#FFFFFF',
      },
      errorCorrectionLevel: 'H', // High error correction
    });

    return dataUrl;
  } catch (error) {
    console.error('Error generating QR code:', error);
    throw new Error('Failed to generate QR code: ' + (error instanceof Error ? error.message : 'Unknown error'));
  }
}
