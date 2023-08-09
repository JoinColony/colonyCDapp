import { TransactionProps } from '../TransactionTable/types';

export interface TransactionItemProps extends TransactionProps {
  id: string;
  onRemoveClick: (key: string) => void;
  onDuplicateClick: (key: string) => void;
  onUpdate: (key: string, values: TransactionProps) => void;
}
