import React from 'react';

import CopyableAddress from '~shared/CopyableAddress';
import Heading from '~shared/Heading';
import Icon from '~shared/Icon';

import { Icons } from '~constants';

import { useAppContext } from '~hooks';

import styles from './GasStationHeader.css';

interface Props {
  close?: () => void;
}

const displayName = 'frame.GasStation.GasStationHeader';

const GasStationHeader = ({ close }: Props) => {
  const { wallet } = useAppContext();

  return (
    <div className={styles.main}>
      <div className={styles.walletDetails}>
        <div className={styles.walletHeading}>
          <Heading
            appearance={{ margin: 'none', size: 'normal' }}
            text={{ id: 'wallet' }}
          />
        </div>
        <div className={styles.walletAddress}>
          <CopyableAddress>{wallet?.address || ''}</CopyableAddress>
        </div>
      </div>
      <div className={styles.actionsContainer}>
        {close && (
          <button
            className={styles.closeButton}
            onClick={close}
            type="button"
            data-test="closeGasStationButton"
          >
            <Icon
              appearance={{ size: 'normal' }}
              name={Icons.Close}
              title={{ id: 'button.close' }}
            />
          </button>
        )}
      </div>
    </div>
  );
};

GasStationHeader.displayName = displayName;

export default GasStationHeader;
