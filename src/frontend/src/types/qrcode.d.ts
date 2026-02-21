// Type declarations for qrcode library loaded via CDN
declare global {
  interface Window {
    QRCode?: {
      toDataURL: (
        text: string,
        options?: {
          version?: number;
          errorCorrectionLevel?: 'L' | 'M' | 'Q' | 'H';
          margin?: number;
          scale?: number;
          width?: number;
          color?: {
            dark?: string;
            light?: string;
          };
          type?: 'image/png' | 'image/jpeg' | 'image/webp';
          quality?: number;
        }
      ) => Promise<string>;
      toCanvas: (
        canvas: HTMLCanvasElement,
        text: string,
        options?: any
      ) => Promise<void>;
      toString: (text: string, options?: any) => Promise<string>;
    };
  }
}

export {};
