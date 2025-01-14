import { type FieldValues } from 'react-hook-form';

import { type Action } from '~constants/actions.ts';

export interface MeatballMenuProps {
  action?: Action;
  transactionHash: string;
  defaultValues?: FieldValues;
  showRedoItem?: boolean;
}
