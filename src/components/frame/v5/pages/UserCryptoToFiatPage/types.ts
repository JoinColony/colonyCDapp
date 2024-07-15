import { type Icon } from '@phosphor-icons/react';

import { type CheckKycStatusMutation } from '~gql';

// @TODO: Figure out proper types, with fragments
export type KycStatusData = NonNullable<
  CheckKycStatusMutation['bridgeXYZMutation']
>;

export interface CryptoToFiatPageComponentProps {
  order: number;
  kycStatusData: KycStatusData | null;
}

export type StatusPillScheme = {
  icon?: Icon;
  iconClassName?: string;
  bgClassName: string;
  textClassName: string;
  copy: string;
};
