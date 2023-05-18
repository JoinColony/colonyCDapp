type StatusType = 'passed' | 'failed';

export interface TransactionHeaderProps {
  title: string;
  description: string;
  date: string;
  status?: StatusType;
}

export interface TransactionsContent {
  key: string;
  title: string;
  notificationInfo?: string;
  status?: StatusType;
  isCurrentAction?: boolean;
  isPending?: boolean;
}

export interface TransactionsItemProps extends TransactionHeaderProps {
  key: string;
  content?: TransactionsContent[];
  isOpen?: boolean;
  onClick?: () => void;
}

export interface TransactionsProps {
  items: TransactionsItemProps[];
  openIndex?: number;
  onOpenIndexChange?: (newOpenIndex: number | undefined) => void;
}
