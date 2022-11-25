import React from 'react';
import { FormattedMessage } from 'react-intl';

// import { MiniSpinnerLoader } from '~shared/Preloaders';
import { SimpleMessageValues } from '~types/index';

// import { AppState } from './AvatarDropdown';

import styles from './AvatarDropdownPopoverMobile.css';

const displayName = 'frame.AvatarDropdown.ItemContainer';

const ItemContainer = ({
  message,
}: // children,
// spinnerMsg,
// appState,
{
  message: SimpleMessageValues;
  children?: React.ReactChild | false | null;
  spinnerMsg: SimpleMessageValues;
  // appState: AppState;
}) => {
  // const {
  //   previousWalletConnected,
  //   attemptingAutoLogin,
  //   userDataLoading,
  //   userCanNavigate,
  // } = appState;

  return (
    <div className={styles.itemContainer}>
      <FormattedMessage {...message} />
      <div className={styles.itemChild}>
        {/* {previousWalletConnected && attemptingAutoLogin && userDataLoading ? ( */}
        {/* {attemptingAutoLogin ? (
          <MiniSpinnerLoader
            className={styles.walletAutoLogin}
            title={spinnerMsg}
            titleTextValues={{ isMobile: true }}
          />
        ) : ( */}
        children
        {/* )} */}
      </div>
    </div>
  );
};

ItemContainer.displayName = displayName;

export default ItemContainer;
