import { type CheckKycStatusMutation } from '~gql';

// @TODO: Figure out proper types, with fragments
export type KycStatusData = NonNullable<
  CheckKycStatusMutation['bridgeXYZMutation']
>;

export interface CryptoToFiatPageComponentProps {
  order: number;
  kycStatusLoading: boolean;
  kycStatusData?: KycStatusData | null;
  refetchStatus: () => void;
}

export interface BankDetailsFormValues {
  currency: string;
  bankName: string;
  accountOwner: string;
  iban: string;
  swift: string;
  country: string;
  accountNumber: string;
  routingNumber: string;
  address1: string;
  address2: string;
  postcode: string;
  city: string;
  state: string;
}
