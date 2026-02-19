import { useState, useEffect } from 'react';
import { Evidence, EvidenceType, Platform, Region } from '../types/backend-extended';

const DB_NAME = 'RotasEDireitosDB';
const STORE_NAME = 'evidenceMedia';
const EVIDENCE_STORE_NAME = 'evidence';
const DB_VERSION = 3;

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
      if (!db.objectStoreNames.contains(EVIDENCE_STORE_NAME)) {
        db.createObjectStore(EVIDENCE_STORE_NAME, { keyPath: 'id' });
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

// Evidence storage functions
let nextEvidenceId = 1;

export interface SaveEvidenceParams {
  evidenceType: EvidenceType;
  notes: string;
  platform?: Platform;
  regiao?: Region;
  bairro?: string;
  mediaBytes: Uint8Array;
  duration?: bigint;
  audioQuality?: string;
  videoQuality?: string;
}

export async function saveEvidenceToIndexedDB(params: SaveEvidenceParams): Promise<bigint> {
  const db = await getDB();
  const evidenceId = nextEvidenceId++;
  
  // Store evidence metadata
  const evidence: Evidence = {
    id: BigInt(evidenceId),
    owner: { __kind__: 'None' } as any, // Placeholder
    uploadTime: BigInt(Date.now()),
    evidenceType: params.evidenceType,
    notes: params.notes,
    platform: params.platform,
    regiao: params.regiao,
    bairro: params.bairro,
    duration: params.duration,
    audioQuality: params.audioQuality,
    videoQuality: params.videoQuality,
  };

  const transaction = db.transaction(EVIDENCE_STORE_NAME, 'readwrite');
  const store = transaction.objectStore(EVIDENCE_STORE_NAME);
  store.put(evidence);

  await new Promise<void>((resolve, reject) => {
    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error);
  });

  // Store media - create a new ArrayBuffer from Uint8Array
  const arrayBuffer = new ArrayBuffer(params.mediaBytes.byteLength);
  const view = new Uint8Array(arrayBuffer);
  view.set(params.mediaBytes);
  
  const mimeType = params.evidenceType === EvidenceType.audio ? 'audio/webm' :
                   params.evidenceType === EvidenceType.video ? 'video/webm' : 'image/jpeg';
  const mediaType = params.evidenceType === EvidenceType.audio ? 'audio' :
                    params.evidenceType === EvidenceType.video ? 'video' : 'image';
  
  await storeEvidenceMedia(evidenceId, arrayBuffer, mimeType, mediaType);

  return BigInt(evidenceId);
}

export async function getAllEvidenceFromIndexedDB(): Promise<Evidence[]> {
  const db = await getDB();
  const transaction = db.transaction(EVIDENCE_STORE_NAME, 'readonly');
  const store = transaction.objectStore(EVIDENCE_STORE_NAME);
  const request = store.getAll();

  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result || []);
    request.onerror = () => reject(request.error);
  });
}

export function useEvidenceFromIndexedDB(): { evidence: Evidence[]; isLoading: boolean } {
  const [evidence, setEvidence] = useState<Evidence[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getAllEvidenceFromIndexedDB()
      .then((data) => {
        setEvidence(data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error('Failed to load evidence:', error);
        setIsLoading(false);
      });
  }, []);

  return { evidence, isLoading };
}

export function useMediaFromIndexedDB(evidenceId?: bigint): { mediaUrl: string | null; isLoading: boolean } {
  const [mediaUrl, setMediaUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!evidenceId) {
      setIsLoading(false);
      return;
    }

    let objectUrl: string | null = null;

    getEvidenceMedia(Number(evidenceId))
      .then((media) => {
        if (media) {
          const blob = new Blob([media.data], { type: media.mimeType });
          objectUrl = URL.createObjectURL(blob);
          setMediaUrl(objectUrl);
        }
        setIsLoading(false);
      })
      .catch((error) => {
        console.error('Failed to load media:', error);
        setIsLoading(false);
      });

    return () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [evidenceId]);

  return { mediaUrl, isLoading };
}
