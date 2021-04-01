import BN from 'bn.js';

export interface ToBn {
  toBn: () => BN;
}

export interface ToBnOptions {
  isLe?: boolean;
  isNegative?: boolean;
}

export interface SiDef {
  power: number;
  text: string;
  value: string;
}
