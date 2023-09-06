export interface TransactionProps {
  key: number;
  recipent: string;
  amount: string;
  token: string;
}

export interface TransactionTableProps extends Omit<TransactionProps, 'key'> {
  burgerMenu?: Element;
}
