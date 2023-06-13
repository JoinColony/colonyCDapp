import React, { useRef, useEffect } from 'react';
import { AddressZero } from '@ethersproject/constants';

import MaskedAddress from '~shared/MaskedAddress';
import { isEmpty } from '~utils/lodash';
import { removeValueUnits } from '~utils/css';

import { User } from '~types';
import { useColonyContext } from '~hooks';

import styles from './FriendlyName.css';

const displayName = 'FriendlyName';

interface Props {
  /**  The user object to display */
  user?: User | null;
  /** Whether to show a masked address or a full one */
  maskedAddress?: boolean;
  /** Whether to apply the "shrink tech font by 1px" logic */
  autoShrinkAddress?: boolean;
}

const FriendlyName = ({
  user,
  maskedAddress = true,
  autoShrinkAddress = false,
}: Props) => {
  const { colony } = useColonyContext();
  const addressRef = useRef<HTMLElement>(null);
  const colonyDisplayName = colony?.metadata?.displayName || colony?.name;
  const colonyDisplayAddress =
    colony?.colonyAddress !== AddressZero ? colony?.colonyAddress : '';
  const walletAddress = user?.walletAddress;
  const userDisplayName = user?.profile?.displayName || user?.name;
  const userDisplayAddress = walletAddress !== AddressZero ? walletAddress : '';

  /*
   * We always make (for this component only), the address
   * size to be 1px smaller than the rest of the text because
   * the "tech" font we user renders a bit larger than our display font while
   * using the same font size.
   */
  useEffect(() => {
    if (autoShrinkAddress && addressRef?.current) {
      const computedStyles = getComputedStyle(addressRef.current);
      const inheritedFontSize = removeValueUnits(computedStyles.fontSize);
      addressRef.current.style.fontSize = `${inheritedFontSize - 1}px`;
    }
  }, [addressRef, autoShrinkAddress]);

  const isColony =
    walletAddress === colony?.colonyAddress ||
    (isEmpty(user) && !isEmpty(colony));

  return (
    <div className={styles.main}>
      <div className={styles.name}>
        {userDisplayName || (isColony && colonyDisplayName) || (
          <MaskedAddress
            address={userDisplayAddress || colonyDisplayAddress || AddressZero}
            full={!maskedAddress}
            ref={addressRef}
          />
        )}
      </div>
    </div>
  );
};

FriendlyName.displayName = displayName;

export default FriendlyName;
