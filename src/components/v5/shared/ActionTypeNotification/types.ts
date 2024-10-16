import { type CoreAction } from '~actions';

export interface ActionTypeNotificationProps {
  selectedAction: CoreAction;
  className?: string;
  isFieldDisabled?: boolean;
}
