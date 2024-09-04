import { type Expenditure, type ColonyAction } from '~types/graphql.ts';

export enum ExpenditureStep {
  Create = 'CREATE',
  Review = 'REVIEW',
  Funding = 'FUNDING',
  Release = 'RELEASE',
  Payment = 'PAYMENT',
  Cancel = 'CANCEL',
}

export interface PaymentBuilderWidgetProps {
  action: ColonyAction;
}

export interface FundingStepProps {
  expenditure: Expenditure | undefined | null;
  expectedStepKey: ExpenditureStep | null;
}

export interface ReleaseStepProps {
  expenditure: Expenditure | undefined | null;
  expectedStepKey: ExpenditureStep | null;
  expenditureStep: ExpenditureStep | null;
}
