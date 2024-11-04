import { type ModalProps } from '~v5/shared/Modal/types.ts';

export interface AddTransactionFormModalProps extends ModalProps {
  onSubmit: (link: AddTransactionTableModel) => void;
  defaultValues: any;
}

export interface AddTransactionTableModel {
  contract: string;
  json: string;
  key: string;
}
