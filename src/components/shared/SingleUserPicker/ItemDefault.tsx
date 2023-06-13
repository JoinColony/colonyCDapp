import React, { ReactNode } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import cx from 'classnames';

import { Address, User } from '~types';
import { ItemDataType } from '~shared/OmniPicker';
import MaskedAddress from '~shared/MaskedAddress';
import UserMention from '~shared/UserMention';
import { isAddress } from '~utils/web3';

import styles from './ItemDefault.css';

const MSG = defineMessages({
  ownName: {
    id: 'SingleUserPicker.ItemWithYouText.youText',
    defaultMessage: '(you)',
  },
});

interface Props {
  walletAddress?: Address;
  itemData: ItemDataType<User>;
  renderAvatar: (user: ItemDataType<User>) => ReactNode;
  selected?: boolean;
  showAddress?: boolean;

  /*
   * Same as showAddress, just display a masked (shortened) address instead
   */
  showMaskedAddress?: boolean;
  dataTest?: string;
}
const ItemDefault = ({
  walletAddress,
  itemData: { profile, walletAddress: userAddress, name: username },
  itemData,
  renderAvatar,
  showAddress,
  showMaskedAddress,
  dataTest,
}: Props) => (
  <span
    className={cx(styles.main, {
      [styles.showAddress]: showAddress || showMaskedAddress,
    })}
    data-test={dataTest}
  >
    {renderAvatar(itemData)}
    <span className={styles.dataContainer}>
      {profile?.displayName && (
        <span className={styles.displayName}>
          {profile?.displayName}
          {isAddress(walletAddress || '') &&
            isAddress(userAddress) &&
            walletAddress === userAddress && (
              <span className={styles.thatsYou}>
                &nbsp;
                <FormattedMessage {...MSG.ownName} />
              </span>
            )}
          &nbsp;
        </span>
      )}
      {username && <UserMention user={itemData} hasLink={false} />}
      {showAddress && <span className={styles.address}>{userAddress}</span>}
      {!showAddress && showMaskedAddress && (
        <span className={styles.address}>
          <MaskedAddress address={userAddress} />
        </span>
      )}
    </span>
  </span>
);

ItemDefault.displayName = 'SingleUserPicker.ItemDefault';

export default ItemDefault;
