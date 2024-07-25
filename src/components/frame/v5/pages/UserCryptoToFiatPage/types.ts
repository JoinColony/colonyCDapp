import { type useCheckKycStatusMutation } from '~gql';

export type CheckKycStatusMutationReturnType = ReturnType<
  typeof useCheckKycStatusMutation
>;

export type KycStatusData = NonNullable<
  CheckKycStatusMutationReturnType[1]['data']
>['bridgeXYZMutation'];

export type KycBankAccountData = NonNullable<KycStatusData>['bankAccount'];

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
