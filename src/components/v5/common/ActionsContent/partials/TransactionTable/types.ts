export interface TransactionProps {
  key: number;
  recipent: string;
  amount: string;
  token: string;
}

export interface TransactionTableProps extends TransactionProps {
  menu?: Element;
}
