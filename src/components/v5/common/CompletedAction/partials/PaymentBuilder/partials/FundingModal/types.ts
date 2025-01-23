import { type ExpenditurePayout } from '~gql';
import { type Expenditure } from '~types/graphql.ts';
import { type ModalProps } from '~v5/shared/Modal/types.ts';

export type TokenItemProps = Omit<ExpenditurePayout, 'isClaimed'>;

export interface FundingModalProps extends ModalProps {
  expenditure: Expenditure;
  onSuccess: () => void;
}

export interface FundingModalContentProps extends Pick<ModalProps, 'onClose'> {
  fundingItems: TokenItemProps[];
  fundingDomainName: string;
  fundingDomainId: number;
}
