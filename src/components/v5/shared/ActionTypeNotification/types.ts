import { type Action } from '~constants/actions.ts';

export interface ActionTypeNotificationProps {
  selectedAction: Action;
  className?: string;
  isFieldDisabled?: boolean;
}
