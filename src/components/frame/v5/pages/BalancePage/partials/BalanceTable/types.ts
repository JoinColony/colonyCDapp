import { TableSort } from '~hooks/useTableSort';

export enum BalanceTableSortFields {
  BALANCE = 'balance',
}

export type BalanceTableSort = TableSort<BalanceTableSortFields>;
