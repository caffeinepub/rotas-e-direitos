import { useState, useEffect } from 'react';

const DB_NAME = 'RotasEDireitosDB';
const STORE_NAME = 'evidenceMedia';
const DB_VERSION = 2;

let dbPromise: Promise<IDBDatabase> | null = null;

function getDB(): Promise<IDBDatabase> {
  if (dbPromise) return dbPromise;

  dbPromise = new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };
  });

  return dbPromise;
}

export interface StoredMedia {
  data: ArrayBuffer;
  mimeType: string;
  mediaType: 'image' | 'audio' | 'video';
}

export async function storeEvidenceMedia(
  evidenceId: number,
  data: ArrayBuffer,
  mimeType: string,
  mediaType: 'image' | 'audio' | 'video'
): Promise<void> {
  const db = await getDB();
  const transaction = db.transaction(STORE_NAME, 'readwrite');
  const store = transaction.objectStore(STORE_NAME);
  
  const media: StoredMedia = { data, mimeType, mediaType };
  store.put(media, evidenceId);

  return new Promise((resolve, reject) => {
    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error);
  });
}

export async function getEvidenceMedia(evidenceId: number): Promise<StoredMedia | null> {
  const db = await getDB();
  const transaction = db.transaction(STORE_NAME, 'readonly');
  const store = transaction.objectStore(STORE_NAME);
  const request = store.get(evidenceId);

  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result || null);
    request.onerror = () => reject(request.error);
  });
}

export function useEvidenceMedia(evidenceId: number): { url: string | null; mediaType: string | null } {
  const [url, setUrl] = useState<string | null>(null);
  const [mediaType, setMediaType] = useState<string | null>(null);

  useEffect(() => {
    let objectUrl: string | null = null;

    getEvidenceMedia(evidenceId)
      .then((media) => {
        if (media) {
          const blob = new Blob([media.data], { type: media.mimeType });
          objectUrl = URL.createObjectURL(blob);
          setUrl(objectUrl);
          setMediaType(media.mediaType);
        }
      })
      .catch((error) => {
        console.error('Failed to load evidence media:', error);
      });

    return () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [evidenceId]);

  return { url, mediaType };
}

// Legacy support for existing image-only code
export async function storeEvidenceImage(evidenceId: number, imageData: ArrayBuffer): Promise<void> {
  return storeEvidenceMedia(evidenceId, imageData, 'image/jpeg', 'image');
}

export async function getEvidenceImage(evidenceId: number): Promise<ArrayBuffer | null> {
  const media = await getEvidenceMedia(evidenceId);
  return media?.data || null;
}

export function useEvidenceImage(evidenceId: number): string | null {
  const { url } = useEvidenceMedia(evidenceId);
  return url;
}
