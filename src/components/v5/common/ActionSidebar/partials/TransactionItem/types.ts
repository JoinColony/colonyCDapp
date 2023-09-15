import { TransactionProps } from '../TransactionTable/types';

export interface TransactionItemProps extends TransactionProps {
  id: number;
  onRemoveClick: (key: number) => void;
  onDuplicateClick: (key: number) => void;
  onUpdate: (key: number, values: TransactionProps) => void;
}
