import { TransactionOrMessageGroups } from '~frame/GasStation/transactionGroup';

export interface UserReputationProps {
  transactionAndMessageGroups: TransactionOrMessageGroups;
  hideColonies?: boolean;
  isUserHubOpen?: boolean;
  hideMemberReputationOnMobile?: boolean;
}
