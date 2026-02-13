import { useState, useEffect } from 'react';

const DB_NAME = 'RotasEDireitosDB';
const STORE_NAME = 'evidenceImages';
const DB_VERSION = 1;

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

export async function storeEvidenceImage(evidenceId: number, imageData: ArrayBuffer): Promise<void> {
  const db = await getDB();
  const transaction = db.transaction(STORE_NAME, 'readwrite');
  const store = transaction.objectStore(STORE_NAME);
  store.put(imageData, evidenceId);

  return new Promise((resolve, reject) => {
    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error);
  });
}

export async function getEvidenceImage(evidenceId: number): Promise<ArrayBuffer | null> {
  const db = await getDB();
  const transaction = db.transaction(STORE_NAME, 'readonly');
  const store = transaction.objectStore(STORE_NAME);
  const request = store.get(evidenceId);

  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result || null);
    request.onerror = () => reject(request.error);
  });
}

export function useEvidenceImage(evidenceId: number): string | null {
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  useEffect(() => {
    let objectUrl: string | null = null;

    getEvidenceImage(evidenceId)
      .then((data) => {
        if (data) {
          const blob = new Blob([data], { type: 'image/jpeg' });
          objectUrl = URL.createObjectURL(blob);
          setImageUrl(objectUrl);
        }
      })
      .catch((error) => {
        console.error('Failed to load evidence image:', error);
      });

    return () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [evidenceId]);

  return imageUrl;
}
