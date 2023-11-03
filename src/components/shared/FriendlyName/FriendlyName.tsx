import React, { useRef, useEffect } from 'react';
import { AddressZero } from '@ethersproject/constants';

import MaskedAddress from '~shared/MaskedAddress';
import { removeValueUnits } from '~utils/css';

import { Colony, ColonyExtension, Token, User } from '~types';

import styles from './FriendlyName.css';
import { getAddressFromAgent, getDisplayNameFromAgent } from './helpers';
import { SimpleTarget } from '~gql';

const displayName = 'FriendlyName';

export interface FriendlyNameProps {
  /**  The object representing the agent initiating the action */
  agent?: User | Colony | ColonyExtension | Token | SimpleTarget | null;
  /** Whether to show a masked address or a full one */
  maskedAddress?: boolean;
  /** Whether to apply the "shrink tech font by 1px" logic */
  autoShrinkAddress?: boolean;
}

const FriendlyName = ({
  agent,
  maskedAddress = true,
  autoShrinkAddress = false,
}: FriendlyNameProps) => {
  const addressRef = useRef<HTMLElement>(null);
  const agentDisplayName = getDisplayNameFromAgent(agent);

  /*
   * We always make (for this component only), the address
   * size to be 1px smaller than the rest of the text because
   * the "tech" font we use renders a bit larger than our display font while
   * using the same font size.
   */
  useEffect(() => {
    if (autoShrinkAddress && addressRef?.current) {
      const computedStyles = getComputedStyle(addressRef.current);
      const inheritedFontSize = removeValueUnits(computedStyles.fontSize);
      addressRef.current.style.fontSize = `${inheritedFontSize - 1}px`;
    }
  }, [addressRef, autoShrinkAddress]);

  return (
    <div className={styles.main}>
      <div className={styles.name}>
        {agentDisplayName || (
          <MaskedAddress
            address={getAddressFromAgent(agent) ?? AddressZero}
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
