import React from 'react';
import { FormattedMessage } from 'react-intl';

import { MiniSpinnerLoader } from '~shared/Preloaders';
import { SimpleMessageValues } from '~types/index';

import styles from './AvatarDropdownPopoverMobile.css';

const displayName = 'frame.AvatarDropdown.ItemContainer';

const ItemContainer = ({
  message,
  children,
  spinnerMsg,
}: {
  message: SimpleMessageValues;
  children?: React.ReactNode | false | null;
  spinnerMsg: SimpleMessageValues;
}) => {
  return (
    <div className={styles.itemContainer}>
      <FormattedMessage {...message} />
      <div className={styles.itemChild}>
        {/* {previousWalletConnected && attemptingAutoLogin && userDataLoading ? ( */}
        {true ? (
          <MiniSpinnerLoader
            className={styles.walletAutoLogin}
            title={spinnerMsg}
            titleTextValues={{ isMobile: true }}
          />
        ) : (
          children
        )}
      </div>
    </div>
  );
};

ItemContainer.displayName = displayName;

export default ItemContainer;
