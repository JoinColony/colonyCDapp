import { type FieldValues } from 'react-hook-form';

import { type ModalBaseProps } from '~v5/shared/Modal/types.ts';

export interface CreateStakedExpenditureModalProps
  extends Pick<ModalBaseProps, 'isOpen'> {
  onCloseClick: () => void;
  formValues: FieldValues;
}
