import { TransactionOrMessageGroups } from '~frame/GasStation/transactionGroup';

export interface UserReputationProps {
  transactionAndMessageGroups: TransactionOrMessageGroups;
  hideColonies?: boolean;
}

export interface UserNavigationProps {
  hideColonies?: boolean;
}
