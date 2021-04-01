import { RING_PROPERTIES } from '../../config/runtime';
import { SiDef } from '../interfaces';

export const SI_MID = 0;

export const SI: SiDef[] = [
  // { power: -24, value: 'y', text: 'yocto' },
  // { power: -21, value: 'z', text: 'zepto' },
  // { power: -18, value: 'a', text: 'atto' },
  // { power: -15, value: 'f', text: 'femto' },
  // { power: -12, value: 'p', text: 'pico' },
  // { power: -9, value: 'n', text: 'nano' },
  // { power: -6, value: 'µ', text: 'micro' },
  // { power: -3, value: 'm', text: 'milli' },
  { power: 0, value: '-', text: RING_PROPERTIES.tokenSymbol }, // position 8
  // { power: 3, value: 'k', text: 'Kilo' },
  // { power: 6, value: 'M', text: 'Mega' },
  // { power: 9, value: 'G', text: 'Giga' },
  // { power: 12, value: 'T', text: 'Tera' },
  // { power: 15, value: 'P', text: 'Peta' },
  // { power: 18, value: 'E', text: 'Exa' },
  // { power: 21, value: 'Z', text: 'Zeta' },
  // { power: 24, value: 'Y', text: 'Yotta' }
];

// Given a SI type (e.g. k, m, Y) find the SI definition
export function findSi(type: string): SiDef {
  // use a loop here, better RN support (which doesn't have [].find)
  for (const item of SI) {
    if (item.value === type) {
      return item;
    }
  }

  return SI[SI_MID];
}

export function calcSi(text: string, decimals: number, forceUnit?: string): SiDef {
  if (forceUnit) {
    return findSi(forceUnit);
  }

  // tslint:disable-next-line: no-magic-numbers
  const siDefIndex = SI_MID - 1 + Math.ceil((text.length - decimals) / 3);

  return SI[siDefIndex] || SI[siDefIndex < 0 ? 0 : SI.length - 1];
}
