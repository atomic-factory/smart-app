import BN from 'bn.js';
import { isFunction, isString } from 'lodash';
import { ToBn } from '../interfaces';

export function isBn(value: unknown): value is BN {
  return BN.isBN(value);
}

export function isToBn(value?: unknown): value is ToBn {
  return !!value && isFunction((value as ToBn).toBn);
}

export function isBigInt(value: unknown): value is BigInt {
  return typeof value === 'bigint';
}

const HEX_REGEX = /^0x[a-fA-F0-9]+$/;

// tslint:disable-next-line: cyclomatic-complexity
export function isHex(value: unknown, bitLength = -1, ignoreLength = false): value is string {
  const isValidHex = value === '0x' || (isString(value) && HEX_REGEX.test(value.toString()));

  if (isValidHex && bitLength !== -1) {
    // tslint:disable-next-line: no-magic-numbers
    return (value as string).length === 2 + Math.ceil(bitLength / 4);
  }

  // tslint:disable-next-line: no-magic-numbers
  return isValidHex && (ignoreLength || (value as string).length % 2 === 0);
}
