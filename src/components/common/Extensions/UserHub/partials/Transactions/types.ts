export interface TransactionsContent {
  key: string;
  title: string;
  info?: string;
  state?: 'passed' | 'failed';
  isCurrentAction?: boolean;
}

export interface TransactionsItem {
  key: string;
  title: string;
  description: string;
  date: string;
  state?: 'passed' | 'failed';
  content: TransactionsContent[];
}

export interface TransactionsProps {
  items: TransactionsItem[];
  openIndex?: number;
  onOpenIndexChange?: (newOpenIndex: number | undefined) => void;
}
