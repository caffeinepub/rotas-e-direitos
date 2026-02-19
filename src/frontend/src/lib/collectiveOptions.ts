import { Region } from '../types/backend-extended';

export const REGIONS: { value: Region; label: string }[] = [
  { value: Region.fortaleza, label: 'Fortaleza' },
  { value: Region.caucaia, label: 'Caucaia' },
  { value: Region.maracanau, label: 'Maracanaú' },
];

const neighborhoodsByRegion: Record<Region, string[]> = {
  [Region.fortaleza]: [
    'Aldeota',
    'Meireles',
    'Centro',
    'Messejana',
    'Parangaba',
    'Barra do Ceará',
    'Montese',
    'Benfica',
    'Fátima',
    'Dionísio Torres',
  ],
  [Region.caucaia]: [
    'Centro',
    'Jurema',
    'Icaraí',
    'Cumbuco',
    'Tabuba',
  ],
  [Region.maracanau]: [
    'Centro',
    'Jereissati',
    'Pajuçara',
    'Acaracuzinho',
  ],
};

export function getNeighborhoods(region: Region): string[] {
  return neighborhoodsByRegion[region] || [];
}
