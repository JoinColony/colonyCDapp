import { type ApolloClient } from '@apollo/client';

import { mutateWithAuthRetry } from '~apollo/utils.ts';
import {
  type CreateDomainMetadataMutation,
  type CreateDomainMetadataMutationVariables,
  CreateDomainMetadataDocument,
  DomainColor,
  type DomainMetadataFragment,
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
    yield mutateWithAuthRetry(() =>
      apolloClient.mutate<
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
      }),
    );
  } else if (domain?.metadata) {
    const domainMetadata = domain.metadata as DomainMetadataFragment;

    yield mutateWithAuthRetry(() =>
      apolloClient.mutate<
        CreateDomainMetadataMutation,
        CreateDomainMetadataMutationVariables
      >({
        mutation: CreateDomainMetadataDocument,
        variables: {
          input: {
            id: getPendingMetadataDatabaseId(colonyAddress, txHash),
            name: domainName,
            color: domainColor || domainMetadata.color,
            description: domainPurpose || domainMetadata.description,
            changelog: getUpdatedDomainMetadataChangelog({
              transactionHash: txHash,
              metadata: domainMetadata,
              newName: domainName,
              newColor: domainColor,
              newDescription: domainPurpose,
            }),
          },
        },
      }),
    );
  }

  yield createActionMetadataInDB(txHash, customActionTitle);
}
