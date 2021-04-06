import { NetworkConfig } from '../model';

export const NETWORK_STYLE_CONFIG: NetworkConfig<{ logo: string; bgClsName: string }> = {
  crab: { logo: '/image/crab.svg', bgClsName: 'bg-crab' },
  darwinia: { logo: '/image/darwinia.svg', bgClsName: 'bg-darwinia' },
  pangolin: { logo: '/image/pangolin.svg', bgClsName: 'bg-pangolin' },
};