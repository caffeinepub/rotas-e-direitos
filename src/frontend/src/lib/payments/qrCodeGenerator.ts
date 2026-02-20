/**
 * QR Code generator using qrcodejs library
 * Generates QR codes client-side without external API dependencies
 */

// Load qrcodejs library dynamically if not already loaded
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
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js';
    script.async = true;
    script.onload = () => {
      qrCodeLibLoaded = true;
      resolve();
    };
    script.onerror = () => {
      qrCodeLibPromise = null;
      reject(new Error('Failed to load QR code library'));
    };
    document.head.appendChild(script);
  });

  return qrCodeLibPromise;
}

export async function generateQRCodeDataURL(text: string, size: number = 300): Promise<string> {
  try {
    // Load the QR code library
    await loadQRCodeLibrary();

    // Create a temporary container
    const container = document.createElement('div');
    container.style.position = 'absolute';
    container.style.left = '-9999px';
    document.body.appendChild(container);

    try {
      // Generate QR code using qrcodejs
      const QRCode = (window as any).QRCode;
      const qrcode = new QRCode(container, {
        text: text,
        width: size,
        height: size,
        colorDark: '#000000',
        colorLight: '#ffffff',
        correctLevel: QRCode.CorrectLevel.H, // High error correction
      });

      // Wait a bit for the QR code to render
      await new Promise(resolve => setTimeout(resolve, 100));

      // Get the canvas or image element
      const canvas = container.querySelector('canvas') as HTMLCanvasElement;
      const img = container.querySelector('img') as HTMLImageElement;

      let dataUrl: string;

      if (canvas) {
        // If canvas is available, use it directly
        dataUrl = canvas.toDataURL('image/png');
      } else if (img && img.src) {
        // If only image is available, use its src
        dataUrl = img.src;
      } else {
        throw new Error('Failed to generate QR code image');
      }

      return dataUrl;
    } finally {
      // Clean up the temporary container
      document.body.removeChild(container);
    }
  } catch (error) {
    console.error('Error generating QR code:', error);
    throw new Error('Failed to generate QR code');
  }
}
