import { type CheckKycStatusQuery } from '~gql';

export type KycStatusData = NonNullable<CheckKycStatusQuery['bridgeCheckKYC']>;

export type KycBankAccountData = NonNullable<KycStatusData>['bankAccount'];
export interface CryptoToFiatPageComponentProps {
  kycStatusData: KycStatusData | null;
  kycStatusDataIsLoading: boolean;
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
