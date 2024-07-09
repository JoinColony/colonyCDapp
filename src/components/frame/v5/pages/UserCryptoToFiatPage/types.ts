import { type CheckKycStatusMutation } from '~gql';

// @TODO: Figure out proper types, with fragments
export type StatusData = NonNullable<
  CheckKycStatusMutation['bridgeXYZMutation']
>;

export interface CryptoToFiatPageComponentProps {
  order: number;
  statusData: StatusData | null;
}
