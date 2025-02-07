import { type TBalanceTableFilters } from './types.ts';

export const defaultBalanceTableFilters: TBalanceTableFilters = {
  attribute: {
    native: {
      isChecked: false,
    },
    reputation: {
      isChecked: false,
    },
  },
  chain: {},
  token: {},
};
