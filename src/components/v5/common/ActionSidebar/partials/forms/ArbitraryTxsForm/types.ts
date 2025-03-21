import { type ModalProps } from '~v5/shared/Modal/types.ts';

export interface AddTransactionFormModalProps extends ModalProps {
  onSubmit: (link: AddTransactionTableModel) => void;
  defaultValues: AddTransactionTableModel;
}

export interface AddTransactionTableModel {
  contractAddress: string;
  jsonAbi: string;
  key: string;
  method: string;
  args?: Array<{ value: string; type: string; name: string }>;
}
