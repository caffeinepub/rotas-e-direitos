import { Evidence } from '../backend';
import { getEvidenceImage } from './evidenceIndexedDb';

export async function exportEvidenceZip(evidence: Evidence[]): Promise<void> {
  const manifest = evidence.map((e) => ({
    id: Number(e.id),
    type: e.evidenceType,
    platform: e.platform,
    uploadTime: Number(e.uploadTime),
    notes: e.notes,
    region: e.regiao,
    neighborhood: e.bairro,
  }));

  const manifestBlob = new Blob([JSON.stringify(manifest, null, 2)], { type: 'application/json' });
  const manifestUrl = URL.createObjectURL(manifestBlob);

  const a = document.createElement('a');
  a.href = manifestUrl;
  a.download = `evidencias_manifest_${Date.now()}.json`;
  a.click();
  URL.revokeObjectURL(manifestUrl);

  for (const item of evidence) {
    try {
      const imageData = await getEvidenceImage(Number(item.id));
      if (imageData) {
        const blob = new Blob([imageData], { type: 'image/jpeg' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `evidence_${item.id}.jpg`;
        link.click();
        URL.revokeObjectURL(url);
        await new Promise((resolve) => setTimeout(resolve, 100));
      }
    } catch (error) {
      console.error(`Failed to export image for evidence ${item.id}:`, error);
    }
  }

  alert(
    `Exportação iniciada! ${evidence.length + 1} arquivo(s) serão baixados:\n- 1 manifest.json\n- ${evidence.length} imagem(ns)`
  );
}
