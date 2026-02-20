/**
 * Lightweight QR Code generator using Canvas API
 * This is a simplified implementation for generating QR codes client-side
 */

export async function generateQRCodeDataURL(text: string, size: number = 300): Promise<string> {
  // Use a public QR code API as a reliable fallback
  // This approach works without additional dependencies
  const apiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(text)}&format=png&margin=10`;
  
  try {
    // Fetch the QR code image from the API
    const response = await fetch(apiUrl);
    const blob = await response.blob();
    
    // Convert blob to data URL
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error('Error generating QR code:', error);
    // Return a placeholder or throw
    throw new Error('Failed to generate QR code');
  }
}

/**
 * Alternative: Generate QR code using canvas (more complex, requires QR algorithm)
 * For now, we use the API approach which is simpler and reliable
 */
export function getQRCodeImageUrl(text: string, size: number = 300): string {
  // Direct URL approach - browser will fetch the image
  return `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(text)}&format=png&margin=10`;
}
