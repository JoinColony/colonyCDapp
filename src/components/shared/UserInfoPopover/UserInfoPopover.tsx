import React from 'react';
// import isEmpty from 'lodash/isEmpty';
// import { BigNumber } from 'ethers';

// import { SpinnerLoader } from '~shared/Preloaders';
import Tag from '~shared/Tag';
// import { getAllUserRoles } from '~redux/transformers';
import NotAvailableMessage from '../NotAvailableMessage/NotAvailableMessage';
import { MemberUser, User } from '~types';
import {
  useAppContext,
  useColonyContext,
  useUserReputationForTopDomains,
} from '~hooks';

// import UserPermissions from './UserPermissions';
// import UserTokens from './UserTokens';
import UserReputation from './UserReputation';
import UserInfo from './UserInfo';

import styles from './UserInfoPopover.css';

interface Props {
  user?: User | MemberUser | null;
  banned?: boolean;
}

const displayName = 'UserInfoPopover';

const UserInfoPopover = ({ user, banned = false }: Props) => {
  const { colony } = useColonyContext();
  const { wallet } = useAppContext();
  const { walletAddress } = user || {};

  // const { data: nativeTokenAddressData, loading: loadingNativeTokenAddress } =
  //   useColonyNativeTokenQuery({
  //     variables: { address: colonyAddress },
  //   });

  const { userReputation, loadingUserReputation } =
    useUserReputationForTopDomains(colony?.colonyAddress, walletAddress);

  // const { data: userReputationData, loading: loadingUserReputation } =
  //   useUserReputationForTopDomainsQuery({
  //     variables: { address: walletAddress, colonyAddress },
  //   });

  // const allUserRoles = useTransformer(getAllUserRoles, [colony, walletAddress]);
  // const { data: userBalanceData, loading: loadingUserBalance } =
  //   useUserBalanceWithLockQuery({
  //     variables: {
  //       address: walletAddress,
  //       tokenAddress:
  //         nativeTokenAddressData?.processedColony.nativeTokenAddress || '',
  //       colonyAddress,
  //     },
  //     /*
  //     The fetchPolicy here is "no-cache" because otherwise the result would be stored
  //     in the cache and then the current user's balance would change (in the other instances
  //     where the current user balance is obtained using this query) to the one that it's being
  //     displayed in the popover.

  //     It could also happen in reverse, the current user's balance could show up here instead
  //     of the balance of a "second person" user.

  //     Basically, all sorts of shenanigans happen when this result is stored on the cache.
  //   */
  //     fetchPolicy: 'no-cache',
  //   });

  // if (
  //   loadingNativeTokenAddress ||
  //   loadingUserReputation ||
  //   loadingUserBalance
  // ) {
  //   return (
  //     <div className={`${styles.main} ${styles.loadingSpinnerContainer}`}>
  //       <SpinnerLoader
  //         appearance={{
  //           theme: 'primary',
  //           size: 'medium',
  //           layout: 'horizontal',
  //         }}
  //       />
  //     </div>
  //   );
  // }
  // const nativeToken = userBalanceData?.user.userLock.nativeToken;
  // const userLock = userBalanceData?.user.userLock;
  // const inactiveBalance = BigNumber.from(userLock?.nativeToken?.balance || 0);
  // const lockedBalance = BigNumber.from(userLock?.totalObligation || 0);
  // const activeBalance = BigNumber.from(userLock?.activeTokens || 0);
  // const totalBalance = inactiveBalance.add(activeBalance).add(lockedBalance);
  return (
    <div>
      {banned && (
        <div className={styles.bannedTag}>
          <Tag text={{ id: 'label.banned' }} appearance={{ theme: 'banned' }} />
        </div>
      )}
      <div className={styles.main}>
        {user?.walletAddress && (
          <div className={styles.section}>
            {typeof user !== 'undefined' ? (
              <UserInfo user={user} />
            ) : (
              <NotAvailableMessage notAvailableDataName="User" />
            )}
          </div>
        )}
        {colony && (
          <div className={styles.section}>
            <UserReputation
              colony={colony}
              userReputationForTopDomains={userReputation || []}
              isCurrentUserReputation={wallet?.address === walletAddress}
              isUserReputationLoading={loadingUserReputation}
            />
          </div>
        )}
        {/* {!totalBalance.isZero() && nativeToken && (
          <div className={styles.section}>
            <UserTokens totalBalance={totalBalance} nativeToken={nativeToken} />
          </div>
        )} */}
        {/* {!isEmpty(allUserRoles) && (
          <div className={styles.section}>
            <UserPermissions roles={allUserRoles} />
          </div>
        )} */}
      </div>
    </div>
  );
};

UserInfoPopover.displayName = displayName;

export default UserInfoPopover;
