export interface PopoverButtonProps {
  isDisabled?: boolean;
  type: PopoverButtonType;
}

export type PopoverButtonType = 'deposit' | 'withdraw' | 'view';
