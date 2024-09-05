import { type ApolloClient } from '@apollo/client';

import {
  type CreateDomainMetadataMutation,
  type CreateDomainMetadataMutationVariables,
  CreateDomainMetadataDocument,
  DomainColor,
} from '~gql';
import { type ActionTypes } from '~redux/actionTypes.ts';
import {
  createActionMetadataInDB,
  getUpdatedDomainMetadataChangelog,
} from '~redux/sagas/utils/index.ts';
import { type Action } from '~redux/types/index.ts';
import { getPendingMetadataDatabaseId } from '~utils/databaseId.ts';

type Params = Pick<
  Action<ActionTypes.MOTION_MULTISIG_DOMAIN_CREATE_EDIT>['payload'],
  | 'isCreateDomain'
  | 'domain'
  | 'domainName'
  | 'domainColor'
  | 'domainPurpose'
  | 'colonyAddress'
  | 'customActionTitle'
> & { txHash: string; apolloClient: ApolloClient<object> };

export function* handleDomainMetadata({
  isCreateDomain,
  apolloClient,
  domainName,
  domain,
  domainColor,
  domainPurpose,
  colonyAddress,
  txHash,
  customActionTitle,
}: Params) {
  if (isCreateDomain) {
    yield apolloClient.mutate<
      CreateDomainMetadataMutation,
      CreateDomainMetadataMutationVariables
    >({
      mutation: CreateDomainMetadataDocument,
      variables: {
        input: {
          id: getPendingMetadataDatabaseId(colonyAddress, txHash),
          name: domainName,
          color: domainColor || DomainColor.LightPink,
          description: domainPurpose || '',
        },
      },
    });
  } else if (domain?.metadata) {
    yield apolloClient.mutate<
      CreateDomainMetadataMutation,
      CreateDomainMetadataMutationVariables
    >({
      mutation: CreateDomainMetadataDocument,
      variables: {
        input: {
          id: getPendingMetadataDatabaseId(colonyAddress, txHash),
          name: domainName,
          color: domainColor || domain.metadata.color,
          description: domainPurpose || domain.metadata.description,
          changelog: getUpdatedDomainMetadataChangelog({
            transactionHash: txHash,
            metadata: domain.metadata,
            newName: domainName,
            newColor: domainColor,
            newDescription: domainPurpose,
          }),
        },
      },
    });
  }

  yield createActionMetadataInDB(txHash, customActionTitle);
}
