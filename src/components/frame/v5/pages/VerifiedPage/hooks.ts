import { useCallback, useMemo } from 'react';
import { useColonyContext } from '~hooks';
import {
  WhitelistedUser,
  useWhitelistedUsers,
} from '~common/Dialogs/ManageWhitelistDialog/WhitelistedAddresses/helpers';

export const useVerifiedPage = (searchValue?: string) => {
  const { colony } = useColonyContext();
  const whitelistedAddresses = colony?.metadata?.whitelistedAddresses ?? [];
  const users = useWhitelistedUsers(whitelistedAddresses);

  const searchVerified = useCallback(
    (members: WhitelistedUser[]) =>
      members.filter(({ user }) => {
        const { name, walletAddress } = user || {};

        return (
          name?.toLowerCase().startsWith(searchValue?.toLowerCase() ?? '') ||
          walletAddress
            ?.toLowerCase()
            .startsWith(searchValue?.toLowerCase() ?? '')
        );
      }),
    [searchValue],
  );

  const searchedVerified = useMemo(
    () => (searchValue ? searchVerified(users) : users),
    [searchValue, searchVerified, users],
  );

  return {
    searchedVerified,
  };
};
