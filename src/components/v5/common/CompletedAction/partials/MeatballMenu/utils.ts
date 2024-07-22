import { type FieldValues } from 'react-hook-form';

import { type MeatballMenuProps } from './types.ts';

export function isRedoItemProps(props: MeatballMenuProps): props is {
  transactionHash: string;
  showRedoItem: true;
  defaultValues: FieldValues;
} {
  return props.showRedoItem === true;
}
