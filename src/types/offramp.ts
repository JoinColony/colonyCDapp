import { type BridgeXyzMutationBodyInput } from '~gql';

export interface KYCLinksMutationBody {
  email: BridgeXyzMutationBodyInput['email'];
  full_name: BridgeXyzMutationBodyInput['full_name'];
}

export interface PutCustomerMutationBody {
  first_name: BridgeXyzMutationBodyInput['first_name'];
  last_name: BridgeXyzMutationBodyInput['last_name'];
  email: BridgeXyzMutationBodyInput['email'];
  address: BridgeXyzMutationBodyInput['address'];
  birth_date: BridgeXyzMutationBodyInput['birth_date'];
  tax_identification_number: BridgeXyzMutationBodyInput['tax_identification_number'];
  signed_agreement_id: BridgeXyzMutationBodyInput['signed_agreement_id'];
}
