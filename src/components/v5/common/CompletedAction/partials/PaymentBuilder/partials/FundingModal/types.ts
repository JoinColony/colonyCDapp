import { type Action } from '~constants/actions.ts';
import { type ExpenditurePayout } from '~gql';
import { type Expenditure } from '~types/graphql.ts';
import { type ModalProps } from '~v5/shared/Modal/types.ts';

export type TokenItemProps = Omit<ExpenditurePayout, 'isClaimed'>;

export interface FundingModalProps extends ModalProps {
  expenditure: Expenditure;
  onSuccess: () => void;
  actionType: Action;
}

export interface FundingModalContentProps
  extends Pick<FundingModalProps, 'onClose'> {
  fundingItems: TokenItemProps[];
  teamName: string;
  actionType: Action;
}
