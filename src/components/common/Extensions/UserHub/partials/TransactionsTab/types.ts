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
  items: TransactionsItemProps[];
  openIndex?: number;
  onOpenIndexChange?: (newOpenIndex: number | undefined) => void;
}
