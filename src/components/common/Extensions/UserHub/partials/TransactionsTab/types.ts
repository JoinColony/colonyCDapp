export interface TransactionsContent {
  key: string;
  title: string;
  notificationInfo?: string;
  status?: 'passed' | 'failed';
  isCurrentAction?: boolean;
  isPending?: boolean;
}

export interface TransactionsItemProps {
  key: string;
  title: string;
  description: string;
  date: string;
  status?: 'passed' | 'failed';
  content?: TransactionsContent[];
  isOpen?: boolean;
  onClick?: () => void;
}

export interface TransactionsProps {
  items: TransactionsItemProps[];
  openIndex?: number;
  onOpenIndexChange?: (newOpenIndex: number | undefined) => void;
}
