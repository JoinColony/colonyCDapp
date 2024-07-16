import { type CheckKycStatusMutation } from '~gql';

// @TODO: Figure out proper types, with fragments
export type KycStatusData = NonNullable<
  CheckKycStatusMutation['bridgeXYZMutation']
>;

export interface CryptoToFiatPageComponentProps {
  order: number;
  kycStatusData: KycStatusData | null;
}
