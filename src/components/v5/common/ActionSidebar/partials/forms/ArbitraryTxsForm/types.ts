import { type ModalProps } from '~v5/shared/Modal/types.ts';

export interface AddTransactionFormModalProps extends ModalProps {
  onSubmit: (link: AddTransactionTableModel) => void;
}

export interface AddTransactionTableModel {
  contract: string;
  json: string;
  key: string;
  method: string;
  amount: string;
  to: string;
}
