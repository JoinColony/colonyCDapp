import { type CoreAction } from '~actions/index.ts';

export interface ActionTypeNotificationProps {
  selectedAction: CoreAction;
  className?: string;
  isFieldDisabled?: boolean;
}
