import { Status } from './TransactionNotFound/TransactionStatus';

/*
 * Transaction statuses
 */
export const STATUS_MAP: { [k: number]: Status } = {
  0: Status.Failed,
  1: Status.Succeeded,
  2: Status.Pending,
};
