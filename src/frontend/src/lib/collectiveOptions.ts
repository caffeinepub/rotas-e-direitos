import { Region } from '../backend';

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
  [Region.caucaia]: ['Centro', 'Jurema', 'Iparana', 'Cumbuco', 'Tabuba'],
  [Region.maracanau]: ['Centro', 'Jereissati', 'Pajuçara', 'Acaracuzinho', 'Piratininga'],
};

export function getNeighborhoods(region: Region): string[] {
  return neighborhoodsByRegion[region] || [];
}
