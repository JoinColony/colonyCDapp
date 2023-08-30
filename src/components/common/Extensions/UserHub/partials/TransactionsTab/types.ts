import { TransactionOrMessageGroups } from '~frame/GasStation/transactionGroup';
import { TransactionType } from '~redux/immutable';
import { TransactionStatus } from '~gql';

export interface TransactionHeaderProps {
  title: string;
  description: string;
  date: string;
  status: TransactionStatus;
}

export interface TransactionsContent {
  key: string;
  title: string;
  notificationInfo?: string;
  status?: TransactionStatus;
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
  canLoadMoreTransactions: boolean;
  openIndex?: number;
  autoOpenTransaction?: boolean;
  appearance: Appearance;
  fetchMoreTransactions: () => void;
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
  status: TransactionStatus;
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
