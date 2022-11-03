import React from 'react'; // useEffect // useMemo,
// import { defineMessages } from 'react-intl';
// import { useParams } from 'react-router-dom';

// import Icon from '~shared/Icon';
// import MemberReputation from '~shared/MemberReputation';
// import { Tooltip } from '~shared/Popover';

// import UserTokenActivationButton from '~users/UserTokenActivationButton';
import AvatarDropdown from '~frame/AvatarDropdown';

// import {
//   useUserBalanceWithLockQuery,
// } from '~data/index';

// import { groupedTransactionsAndMessages } from '~redux/selectors';

import Wallet from './Wallet';

import styles from './UserNavigation.css';

const displayName = 'frame.RouteLayouts.UserNavigation';

// const MSG = defineMessages({
// userReputationTooltip: {
//   id: `${displayName}.userReputationTooltip`,
//   defaultMessage: 'This is your share of the reputation in this colony',
// },
// });

const UserNavigation = () => {
  // const userLock = userData?.user.userLock;
  // const nativeToken = userLock?.nativeToken;

  return (
    <div className={styles.main}>
      {/* {userCanNavigate && colonyData?.colonyAddress && (
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
              walletAddress={walletAddress}
              colonyAddress={colonyData?.colonyAddress}
              showIconTitle={false}
            />
          </div>
        </Tooltip>
      )} */}
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
      <AvatarDropdown preventTransactions={false} colony={{}} />
      {/* <AvatarDropdown
        preventTransactions={!isNetworkAllowed}
        colony={colonyData?.processedColony as Colony}
      /> */}
    </div>
  );
};

UserNavigation.displayName = displayName;

export default UserNavigation;
