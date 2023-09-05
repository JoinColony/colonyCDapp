import React, { ReactElement } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import { PopperOptions } from 'react-popper-tooltip';

import { Safe } from '~types';
import ExternalLink from '~shared/ExternalLink';
import { getSafeLink } from '~constants/externalUrls';
import { ETHEREUM_NETWORK, SUPPORTED_SAFE_NETWORKS } from '~constants';
import Button from '~shared/Button';
import Popover, { PopoverChildFn } from '~shared/Popover';
import { DialogType } from '~shared/Dialog';

import SafeInfo from './SafeInfo';

import styles from './SafeInfoPopover.css';

interface Props {
  safe: Safe;
  openControlSafeDialog: (safe: Safe) => DialogType<any>;
  children: ReactElement | PopoverChildFn;
  popperOptions?: PopperOptions;
}

const displayName = 'SafeInfoPopover';

const MSG = defineMessages({
  buttonText: {
    id: `${displayName}.buttonText`,
    defaultMessage: 'Control the Safe',
  },
  linkText: {
    id: `${displayName}.linkText`,
    defaultMessage: 'Go to the Safe',
  },
});

const SafeInfoPopover = ({
  safe,
  openControlSafeDialog,
  children,
  popperOptions,
}: Props) => {
  const selectedChain = SUPPORTED_SAFE_NETWORKS.find(
    (network) => network.chainId === Number(safe.chainId),
  );
  const safeLink = getSafeLink(
    selectedChain?.shortName.toLowerCase() ||
      ETHEREUM_NETWORK.shortName.toLowerCase(),
    safe.address,
  );

  return (
    <Popover
      renderContent={({ close }) => (
        <div className={styles.main}>
          <div className={styles.section}>
            <SafeInfo safe={safe} />
          </div>
          <div className={styles.section}>
            <Button
              appearance={{ theme: 'blue', size: 'small' }}
              text={MSG.buttonText}
              onClick={() => {
                openControlSafeDialog(safe);
                close();
              }}
            />
            <ExternalLink href={safeLink} className={styles.safeLink}>
              <FormattedMessage {...MSG.linkText} />
            </ExternalLink>
          </div>
        </div>
      )}
      popperOptions={popperOptions}
    >
      {children}
    </Popover>
  );
};

SafeInfoPopover.displayName = displayName;

export default SafeInfoPopover;
