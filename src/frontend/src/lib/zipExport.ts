import { Evidence } from '../backend';
import { getEvidenceMedia } from './evidenceIndexedDb';

export async function exportEvidenceFiles(evidences: Evidence[]): Promise<void> {
  if (evidences.length === 0) {
    alert('No evidence selected for export');
    return;
  }

  const manifest = {
    exportDate: new Date().toISOString(),
    evidenceCount: evidences.length,
    evidence: evidences.map((e) => ({
      id: Number(e.id),
      type: e.evidenceType,
      uploadTime: new Date(Number(e.uploadTime) / 1000000).toISOString(),
      notes: e.notes,
      platform: e.platform,
      duration: e.duration ? Number(e.duration) : undefined,
    })),
  };

  const manifestBlob = new Blob([JSON.stringify(manifest, null, 2)], {
    type: 'application/json',
  });
  const manifestUrl = URL.createObjectURL(manifestBlob);
  const manifestLink = document.createElement('a');
  manifestLink.href = manifestUrl;
  manifestLink.download = `evidence_manifest_${Date.now()}.json`;
  manifestLink.click();
  URL.revokeObjectURL(manifestUrl);

  for (const evidence of evidences) {
    try {
      const media = await getEvidenceMedia(Number(evidence.id));
      if (media) {
        const blob = new Blob([media.data], { type: media.mimeType });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        
        let extension = 'bin';
        if (media.mediaType === 'image') extension = 'jpg';
        else if (media.mediaType === 'audio') extension = 'webm';
        else if (media.mediaType === 'video') extension = 'webm';
        
        link.download = `evidence_${evidence.id}_${media.mediaType}.${extension}`;
        link.click();
        URL.revokeObjectURL(url);
        
        await new Promise((resolve) => setTimeout(resolve, 100));
      }
    } catch (error) {
      console.error(`Failed to export evidence ${evidence.id}:`, error);
    }
  }
}
