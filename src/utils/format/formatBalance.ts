import BN from 'bn.js';
import { isBoolean, isUndefined } from 'lodash';
import { bnToBn } from '../bn';
import { SiDef, ToBn } from '../interfaces';
import { formatDecimal } from './formatDecimal';
import { calcSi, findSi, SI, SI_MID } from './si';

interface Defaults {
  decimals: number;
  unit: string;
}

interface Options {
  decimals?: number;
  forceUnit?: string;
  withSi?: boolean;
  withSiFull?: boolean;
  withUnit?: boolean | string;
}

interface BalanceFormatter {
  <ExtToBn extends ToBn>(
    input?: number | string | BN | BigInt | ExtToBn,
    options?: Options,
    decimals?: number
  ): string;
  calcSi(text: string, decimals?: number): SiDef;
  findSi(type: string): SiDef;
  getDefaults(): Defaults;
  getOptions(decimals?: number): SiDef[];
  setDefaults(defaults: Partial<Defaults>): void;
}

const DEFAULT_DECIMALS = 0;
const DEFAULT_UNIT = SI[SI_MID].text;

let defaultDecimals = DEFAULT_DECIMALS;
let defaultUnit = DEFAULT_UNIT;

// Formats a string/number with <prefix>.<postfix><type> notation
// tslint:disable-next-line: cyclomatic-complexity
function _formatBalance<ExtToBn extends ToBn>(
  input?: number | string | BN | BigInt | ExtToBn,
  options: Options | boolean = true,
  optDecimals: number = defaultDecimals
): string {
  let text = bnToBn(input).toString();

  if (text.length === 0 || text === '0') {
    return '0';
  }

  // strip the negative sign so we can work with clean groupings, re-add this in the
  // end when we return the result (from here on we work with positive numbers)
  const isNegative = text[0].startsWith('-');

  if (isNegative) {
    text = text.substr(1);
  }

  // extract options - the boolean case is for backwards-compat
  const {
    decimals = optDecimals,
    // tslint:disable-next-line: no-unnecessary-initializer
    forceUnit = undefined,
    withSi = true,
    withSiFull = false,
    withUnit = true,
  } = isBoolean(options) ? { withSi: options } : options;

  // NOTE We start at midpoint (8) minus 1 - this means that values display as
  // 123.456 instead of 0.123k (so always 6 relevant). Additionally we us ceil
  // so there are at most 3 decimal before the decimal separator
  const si = calcSi(text, decimals, forceUnit);
  const mid = text.length - (decimals + si.power);
  const prefix = text.substr(0, mid);
  const padding = mid < 0 ? 0 - mid : 0;
  const postfix = `${`${new Array(padding + 1).join('0')}${text}`.substr(
    mid < 0 ? 0 : mid
    // tslint:disable-next-line: no-magic-numbers
  )}000`.substr(0, 3);
  const units =
    withSi || withSiFull
      ? si.value === '-'
        ? withUnit
          ? ` ${isBoolean(withUnit) ? si.text : withUnit}`
          : ''
        : `${withSiFull ? ` ${si.text}` : si.value}${
            withUnit ? ` ${isBoolean(withUnit) ? SI[SI_MID].text : withUnit}` : ''
          }`
      : '';

  return `${isNegative ? '-' : ''}${formatDecimal(prefix || '0')}.${postfix}${units}`;
}

export const formatBalance = _formatBalance as BalanceFormatter;

formatBalance.calcSi = calcSi;

formatBalance.findSi = findSi;

formatBalance.getDefaults = (): Defaults => {
  return {
    decimals: defaultDecimals,
    unit: defaultUnit,
  };
};

// get allowable options to display in a dropdown
formatBalance.getOptions = (decimals: number = defaultDecimals): SiDef[] => {
  return SI.filter(({ power }): boolean => (power < 0 ? decimals + power >= 0 : true));
};

// Sets the default decimals to use for formatting (ui-wide)
formatBalance.setDefaults = ({ decimals, unit }: Partial<Defaults>): void => {
  defaultDecimals = isUndefined(decimals) ? defaultDecimals : decimals;
  defaultUnit = isUndefined(unit) ? defaultUnit : unit;

  SI[SI_MID].text = defaultUnit;
};
