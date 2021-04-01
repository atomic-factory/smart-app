import axios, { AxiosInstance } from 'axios';
import { TFunction as i18nT } from 'i18next';

const SUBSCAN_URL_CRAB = 'https://crab.subscan.io';
const SUBSCAN_URL_DARWINIA = 'https://darwinia.subscan.io';
const ETHERSCAN_URL = 'https://ropsten.etherscan.io';
const INIT_VERSION = 'version-2020-05-0101';
let KTON_PROPERTIES = { ss58Format: 42, tokenDecimals: 9, tokenSymbol: 'CKTON' };
let RING_PROPERTIES = { ss58Format: 42, tokenDecimals: 9, tokenSymbol: 'CRING' };

const setRingProperties = (properties: typeof RING_PROPERTIES) => {
  RING_PROPERTIES = {
    ...RING_PROPERTIES,
    ...properties,
  };
};

const setKtonProperties = (properties: typeof KTON_PROPERTIES) => {
  KTON_PROPERTIES = {
    ...KTON_PROPERTIES,
    ...properties,
  };
};

const crabInstance = axios.create({
  baseURL: SUBSCAN_URL_CRAB,
  timeout: 30000,
});

const darwiniaInstance = axios.create({
  baseURL: SUBSCAN_URL_DARWINIA,
  timeout: 30000,
});

const pangolinInstance = axios.create({
  baseURL: 'https://pangolin.subscan.io',
  timeout: 30000,
});

export const instance = {
  'Darwinia Crab': crabInstance,
  'Darwinia CC1': darwiniaInstance,
  'Darwinia Devnet': darwiniaInstance,
  Darwinia: darwiniaInstance,
  Pangolin: pangolinInstance,
};

interface AxParams {
  address: string;
  page: number;
  row: number;
  locked?: number;
  status?: string; // !FIXME: should be literal type;
}

const defaultRowAmount = 10;

async function getBondList(
  axInstance: AxiosInstance,
  { address, locked = 0, page = 0, row = defaultRowAmount, status = 'bonded' }: AxParams
) {
  if (status === 'map') {
    return await axInstance.post('/api/wallet/mapping_history', {
      row,
      page,
      address,
    });
  }

  return await axInstance.post('/api/wallet/bond_list', {
    row,
    page,
    status,
    address,
    locked,
  });
}

function getStakingHistory(
  axInstance: AxiosInstance,
  { address, page = 0, row = defaultRowAmount }: AxParams,
  callback: (...params: any[]) => void
) {
  if (!axInstance) {
    return;
  }

  axInstance
    .post('/api/scan/staking_history', {
      page,
      row,
      address,
    })
    .then((response: { data: any }) => {
      if (callback) {
        callback(response.data);
      }
    })
    .catch((error: {}) => {
      console.log('%c [ error ]-84', 'font-size:13px; background:pink; color:#bf2c9f;', error);
    })
    .finally(function () {
      // always executed
    });
}

const lockLimitOptionsMaker = (t: i18nT): Array<object> => {
  const month = [];

  for (let i = 0; i <= 36; i++) {
    month.push(i);
  }

  const options: object[] = [];

  month.forEach((i) => {
    options.push({
      text:
        i === 0
          ? t('No fixed term (Set a lock period will get additional KTON rewards)')
          : `${i} ${t('Month')}`,
      value: i,
    });
  });

  return options;
};

export {
  SUBSCAN_URL_CRAB,
  RING_PROPERTIES,
  KTON_PROPERTIES,
  setRingProperties,
  setKtonProperties,
  INIT_VERSION,
  ETHERSCAN_URL,
  getBondList,
  getStakingHistory,
  lockLimitOptionsMaker,
};
