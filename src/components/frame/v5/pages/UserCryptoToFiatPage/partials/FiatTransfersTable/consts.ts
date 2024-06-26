import { defineMessages } from 'react-intl';

const displayName = 'v5.pages.UserCryptoToFiatPage.partials.Transfers';

export enum FiatTransferState {
  AwaitingFunds = 'awaiting_funds',
  InReview = 'in_review',
  FundsReceived = 'funds_received',
  PaymentSubmitted = 'payment_submitted',
  PaymentProcessed = 'payment_processed',
  Canceled = 'canceled',
  Error = 'error',
  Returned = 'returned',
  Refunded = 'refunded',
}

export const STATUS_MSGS = defineMessages({
  [FiatTransferState.AwaitingFunds]: {
    id: `${displayName}.awaitingFunds`,
    defaultMessage: 'Awaiting Funds',
  },
  [FiatTransferState.InReview]: {
    id: `${displayName}.inReview`,
    defaultMessage: 'In Review',
  },
  [FiatTransferState.FundsReceived]: {
    id: `${displayName}.fundsReceived`,
    defaultMessage: 'Funds Received',
  },
  [FiatTransferState.PaymentSubmitted]: {
    id: `${displayName}.paymentSubmitted`,
    defaultMessage: 'Payment Submitted',
  },
  [FiatTransferState.PaymentProcessed]: {
    id: `${displayName}.paymentProcessed`,
    defaultMessage: 'Payment Processed',
  },
  [FiatTransferState.Canceled]: {
    id: `${displayName}.canceled`,
    defaultMessage: 'Canceled',
  },
  [FiatTransferState.Error]: {
    id: `${displayName}.error`,
    defaultMessage: 'Error',
  },
  [FiatTransferState.Returned]: {
    id: `${displayName}.returned`,
    defaultMessage: 'Returned',
  },
  [FiatTransferState.Refunded]: {
    id: `${displayName}.refunded`,
    defaultMessage: 'Refunded',
  },
  default: {
    id: `${displayName}.unknown`,
    defaultMessage: 'Unknown',
  },
});

export const statusPillScheme: Record<
  keyof typeof STATUS_MSGS,
  { bgClassName: string; textClassName: string }
> = {
  [FiatTransferState.AwaitingFunds]: {
    bgClassName: 'bg-warning-100',
    textClassName: 'text-xs text-warning-400',
  },
  [FiatTransferState.InReview]: {
    bgClassName: 'bg-gray-100',
    textClassName: 'text-xs text-gray-500',
  },
  [FiatTransferState.FundsReceived]: {
    bgClassName: 'bg-success-100',
    textClassName: 'text-xs text-success-400',
  },
  [FiatTransferState.PaymentSubmitted]: {
    bgClassName: 'bg-success-100',
    textClassName: 'text-xs text-success-400',
  },
  [FiatTransferState.PaymentProcessed]: {
    bgClassName: 'bg-success-100',
    textClassName: 'text-xs text-success-400',
  },
  [FiatTransferState.Canceled]: {
    bgClassName: 'bg-negative-200',
    textClassName: 'text-xs text-negative-400',
  },
  [FiatTransferState.Error]: {
    bgClassName: 'bg-negative-200',
    textClassName: 'text-xs text-negative-400',
  },
  [FiatTransferState.Returned]: {
    bgClassName: 'bg-negative-200',
    textClassName: 'text-xs text-negative-400',
  },
  [FiatTransferState.Refunded]: {
    bgClassName: 'bg-negative-200',
    textClassName: 'text-xs text-negative-400',
  },
  default: {
    bgClassName: 'bg-gray-100',
    textClassName: 'text-xs text-gray-500',
  },
};
