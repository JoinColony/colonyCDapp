import { type ActionData } from '~actions';

export enum ExpenditureStep {
  Create = 'CREATE',
  Review = 'REVIEW',
  Funding = 'FUNDING',
  Release = 'RELEASE',
  Payment = 'PAYMENT',
  Cancel = 'CANCEL',
}

export interface PaymentBuilderWidgetProps {
  actionData: ActionData;
}
