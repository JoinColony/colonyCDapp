import React from 'react'; // useEffect // useMemo,
import { defineMessages, useIntl } from 'react-intl';

// import Icon from '~shared/Icon';
import MemberReputation from '~shared/MemberReputation';
import { Tooltip } from '~shared/Popover';
// import UserTokenActivationButton from '~users/UserTokenActivationButton';
import AvatarDropdown from '~frame/AvatarDropdown';
// import {
//   useUserBalanceWithLockQuery,
// } from '~data/index';
import { useAppContext, useColonyContext, useUserReputation } from '~hooks';
// import { groupedTransactionsAndMessages } from '~redux/selectors';

import Wallet from './Wallet';

import styles from './UserNavigation.css';

const displayName = 'frame.RouteLayouts.UserNavigation';

const MSG = defineMessages({
  userReputationTooltip: {
    id: `${displayName}.userReputationTooltip`,
    defaultMessage: 'This is your share of the reputation in this colony',
  },
});

const UserNavigation = () => {
  const { colony } = useColonyContext();

  const { wallet } = useAppContext();
  const { formatMessage } = useIntl();

  // const userLock = userData?.user.userLock;
  // const nativeToken = userLock?.nativeToken;

  const { userReputation, totalReputation } = useUserReputation(
    colony?.colonyAddress,
    wallet?.address,
  );

  return (
    <div className={styles.main}>
      {colony?.colonyAddress && wallet && (
        <Tooltip
          content={formatMessage(MSG.userReputationTooltip)}
          placement="bottom-start"
          popperOptions={{
            modifiers: [
              {
                name: 'offset',
                options: {
                  offset: [0, 8],
                },
              },
            ],
          }}
        >
          <div className={`${styles.elementWrapper} ${styles.reputation}`}>
            <MemberReputation
              userReputation={userReputation}
              totalReputation={totalReputation}
              showIconTitle={false}
            />
          </div>
        </Tooltip>
      )}
      {/*
        <div className={`${styles.elementWrapper} ${styles.walletWrapper}`}>
          {userCanNavigate && nativeToken && userLock && (
            <UserTokenActivationButton
              nativeToken={nativeToken}
              userLock={userLock}
              colony={colonyData?.processedColony}
              walletAddress={walletAddress}
              dataTest="tokenActivationButton"
            />
          )}
        </div>
      */}
      <Wallet />
      <AvatarDropdown
        /*
         * @TODO Dependency on colony data should be removed from here
         * Hopefully this will be achieved by #66
         */
        colony={{}}
      />
    </div>
  );
};

UserNavigation.displayName = displayName;

export default UserNavigation;
