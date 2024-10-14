import { type ColonyAction } from '~types/graphql.ts';

export enum ExpenditureStep {
  Create = 'CREATE',
  Review = 'REVIEW',
  Funding = 'FUNDING',
  Release = 'RELEASE',
  Payment = 'PAYMENT',
  Cancel = 'CANCEL',
  Edit = 'EDIT',
}

export interface PaymentBuilderWidgetProps {
  action: ColonyAction;
}
