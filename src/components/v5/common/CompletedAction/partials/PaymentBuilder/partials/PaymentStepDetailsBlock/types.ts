import { type Expenditure } from '~types/graphql.ts';

export interface PaymentStepDetailsBlockProps {
  expenditure: Expenditure | null | undefined;
}
