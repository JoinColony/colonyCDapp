import { ColonyRole } from '@colony/colony-js';
import { ContextModule, getContext } from '~context';
import {
  GetColonyExtensionsByColonyAddressDocument,
  GetColonyExtensionsByColonyAddressQuery,
  GetColonyExtensionsByColonyAddressQueryVariables,
} from '~gql';
import { ContributorWithReputation } from '~types';
import { notNull } from '~utils/arrays';
import { unionBy, intersectionBy } from '~utils/lodash';
import { ContributorTypeFilter } from '~v5/common/TableFiltering/types';

export const getExtensionInstallations = async (colonyAddress: string) => {
  const apollo = getContext(ContextModule.ApolloClient);

  const { data } =
    (await apollo.query<
      GetColonyExtensionsByColonyAddressQuery,
      GetColonyExtensionsByColonyAddressQueryVariables
    >({
      query: GetColonyExtensionsByColonyAddressDocument,
      variables: {
        colonyAddress,
      },
    })) ?? {};

  return new Set(
    data?.getExtensionByColonyAndHash?.items
      .filter(notNull)
      .map((colonyExtension) => colonyExtension.id) ?? [],
  );
};

export const intersectContributors = ({
  contributorTypes,
  contributors: {
    contributorsWithReputation,
    permissionedContributors,
    ...restContributors
  },
  permissions,
}: {
  contributors: {
    contributorsWithReputation: ContributorWithReputation[];
    permissionedContributors: ContributorWithReputation[];
    [k: string]: ContributorWithReputation[];
  };
  permissions: ColonyRole[];
  contributorTypes: ContributorTypeFilter[];
}) => {
  // Performing this union first ensures that if an address has both permission and reputation entries, that
  // the entry with reputation will be preserved. This enables us to sort contributors by reputation correctly.
  let allContributors: ContributorWithReputation[] = unionBy(
    contributorsWithReputation,
    permissionedContributors,
    // @ts-ignore
    ...Object.values(restContributors),
    'address',
  );

  if (!permissions.length && contributorTypes.length) {
    allContributors = intersectionBy(
      contributorsWithReputation,
      allContributors,
      'address',
    );
  } else if (permissions.length && !contributorTypes.length) {
    allContributors = intersectionBy(
      allContributors,
      permissionedContributors,
      'address',
    );
  } else if (permissions.length && contributorTypes.length) {
    allContributors = intersectionBy(
      contributorsWithReputation,
      permissionedContributors,
      'address',
    );
  }

  return allContributors;
};
