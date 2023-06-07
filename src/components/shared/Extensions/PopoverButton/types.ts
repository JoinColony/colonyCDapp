export interface PopoverButtonProps {
  type: PopoverButtonType;
  isDisabled?: boolean;
  isFullWidth?: boolean;
}

export type PopoverButtonType = 'deposit' | 'withdraw' | 'view';
