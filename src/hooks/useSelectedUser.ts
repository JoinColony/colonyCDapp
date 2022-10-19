// import { useMemo } from 'react';

// import { AnyUser, useLoggedInUser } from '~data/index';

/*
 * @TODO This needs to be addressed and either refactored or removed
 */

// export const useSelectedUser = (colonyUsers: AnyUser[]) => {
//   const { walletAddress: loggedInUserWalletAddress } = useLoggedInUser();

//   return useMemo(() => {
//     const [firstSubscriber, secondSubscriber] = colonyUsers;

//     if (!secondSubscriber) {
//       return firstSubscriber;
//     }

//     return firstSubscriber.profile.walletAddress === loggedInUserWalletAddress
//       ? secondSubscriber
//       : firstSubscriber;
//   }, [colonyUsers, loggedInUserWalletAddress]);
// };

const useSelectedUser = (...args) => args;

export default useSelectedUser;
