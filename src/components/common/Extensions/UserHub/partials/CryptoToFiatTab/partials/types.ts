// import { type Action, type ActionTypes } from '~redux/index.ts';

export interface TransferFormValues {
  amount: number;
  balance: number;
  convertedAmount: number;
}

export enum FeeType {
  Wire = 'Wire',
  SEPA = 'SEPA',
  ACH = 'ACH',
}

// @TODO: Add this in when the saga is in
// export type CryptoToFiatTransferActionPayload =
//   Action<ActionTypes.CRYPTO_TO_FIAT_TRANSFER>['payload'];
