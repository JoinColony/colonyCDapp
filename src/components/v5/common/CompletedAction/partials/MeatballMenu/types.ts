import { type FieldValues } from 'react-hook-form';

type BaseMeatballMenuProps = {
  transactionHash: string;
  defaultValues?: FieldValues;
};

type WithRedoItem = BaseMeatballMenuProps & {
  showRedoItem?: true;
  defaultValues: FieldValues;
};

type WithoutRedoItem = BaseMeatballMenuProps & {
  showRedoItem: false;
};

export type MeatballMenuProps = WithRedoItem | WithoutRedoItem;
