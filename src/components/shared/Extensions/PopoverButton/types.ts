import { ButtonProps } from '~v5/shared/Button/types';

export interface PopoverButtonProps extends Pick<ButtonProps, 'isFullSize'> {
  type: PopoverButtonType;
  isDisabled?: boolean;
}

export type PopoverButtonType = 'deposit' | 'withdraw' | 'view';
