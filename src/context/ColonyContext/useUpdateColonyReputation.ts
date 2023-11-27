import { useEffect } from 'react';
import { useUpdateContributorsWithReputationMutation } from '~gql';

export const useUpdateColonyReputation = (colonyAddress?: string) => {
  const [updateContributorsWithReputation] =
    useUpdateContributorsWithReputationMutation();

  /*
   * Update colony-wide reputation whenever a user accesses a colony.
   * Note that this (potentially expensive) calculation will only run if there's new reputation data available,
   * so as to conserve resources. Since it runs inside a lambda, it is not a blocking operation.
   */
  useEffect(() => {
    if (colonyAddress) {
      updateContributorsWithReputation({
        variables: { colonyAddress },
      });
    }
  }, [colonyAddress, updateContributorsWithReputation]);
};
