import React from 'react';
import { FormattedMessage } from 'react-intl';

import { MiniSpinnerLoader } from '~shared/Preloaders';
import { SimpleMessageValues } from '~types/index';
import { useAppContext } from '~hooks';

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
  const { wallet } = useAppContext();

  return (
    <div className={styles.itemContainer}>
      <FormattedMessage {...message} />
      <div className={styles.itemChild}>
        {!wallet?.address ? (
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
