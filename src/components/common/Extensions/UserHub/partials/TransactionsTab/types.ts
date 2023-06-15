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
  selected: boolean;
  transaction: TransactionType;
  selectedTransaction: TransactionType;
}

export interface TransactionDetailsProps {
  appearance: Appearance;
  transactionGroup: TransactionType[];
  unselectTransactionGroup: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

export interface GroupedTransactionProps {
  appearance: Appearance;
  transactionGroup: TransactionType[];
  selectedTransactionIdx: number;
  selectedTransaction: TransactionType;
  unselectTransactionGroup: (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => void;
}

export interface TransactionStatusProps {
  groupCount?: number;
  hash?: string;
  status: TRANSACTION_STATUSES;
  loadingRelated?: boolean;
  date?: Date;
}