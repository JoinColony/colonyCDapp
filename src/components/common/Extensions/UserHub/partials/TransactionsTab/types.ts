import { TransactionOrMessageGroups } from '~frame/GasStation/transactionGroup';
import { TransactionType } from '~redux/immutable';
import { TRANSACTION_STATUSES } from '~types';

export interface TransactionHeaderProps {
  title: string;
  description: string;
  date: string;
  status: TRANSACTION_STATUSES;
}

export interface TransactionsContent {
  key: string;
  title: string;
  notificationInfo?: string;
  status?: TRANSACTION_STATUSES;
  isCurrentAction?: boolean;
  isPending?: boolean;
}

export interface TransactionsItemProps extends TransactionHeaderProps {
  key: number;
  content?: TransactionsContent[];
  isOpen?: boolean;
  onClick?: () => void;
}

export interface TransactionsProps {
  transactionAndMessageGroups: TransactionOrMessageGroups;
  openIndex?: number;
  autoOpenTransaction?: boolean;
  appearance: Appearance;
  onOpenIndexChange?: (newOpenIndex: number | undefined) => void;
  close?: () => void;
  setAutoOpenTransaction?: (boolean) => void;
}

export interface Appearance {
  interactive?: boolean;
  required?: boolean;
}

export interface GroupedTransactionContentProps {
  appearance?: Appearance;
  idx: number;
  transaction: TransactionType;
  selected: boolean;
}

export interface TransactionDetailsProps {
  appearance?: Appearance;
  transactionGroup: TransactionType[];
}

export interface GroupedTransactionProps {
  appearance?: Appearance;
  transactionGroup: TransactionType[];
  groupId?: string;
  isContentOpened: boolean;
  onClick: (id?: string) => void;
}

export interface TransactionStatusProps {
  groupCount?: number;
  hash?: string;
  status: TRANSACTION_STATUSES;
  loadingRelated?: boolean;
  date?: Date;
}

export interface TransactionListProps {
  transactionAndMessageGroups: TransactionOrMessageGroups;
}

export interface CancelTransactionProps {
  isShowingCancelConfirmation: boolean;
  handleCancelTransaction;
  toggleCancelConfirmation;
}
