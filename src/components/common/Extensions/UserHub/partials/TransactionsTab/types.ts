import { type TransactionStatus } from '~gql';
import { type TransactionType } from '~redux/immutable/index.ts';

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
  openIndex?: number;
  appearance: Appearance;
  onOpenIndexChange?: (newOpenIndex: number | undefined) => void;
  close?: () => void;
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
  isContentOpened: boolean;
  onToggleExpand?: (id?: string) => void;
  hideSummary?: boolean;
  isClickable?: boolean;
}

export interface TransactionStatusProps {
  groupCount?: number;
  hash?: string;
  status: TransactionStatus;
  loadingRelated?: boolean;
  date?: Date;
  hasError?: boolean;
}

export interface CancelTransactionProps {
  isShowingCancelConfirmation: boolean;
  handleCancelTransaction;
  toggleCancelConfirmation;
}
