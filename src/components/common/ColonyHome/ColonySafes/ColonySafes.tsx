import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import classnames from 'classnames';

import { isEmpty } from '~utils/lodash';
import SafeInfoPopover from '~shared/SafeInfoPopover';
import Heading from '~shared/Heading';
import { Colony, Safe } from '~types';

import styles from './ColonySafes.css';
import { useDialog } from '~shared/Dialog';
import { ControlSafeDialog } from '~common/Dialogs';
import { useEnabledExtensions } from '~hooks';

const displayName = 'common.ColonyHome.ColonySafes';

const MSG = defineMessages({
  title: {
    id: `${displayName}.title`,
    defaultMessage: 'Linked assets',
  },
});

interface Props {
  colony: Colony;
}

const ColonySafes = ({ colony: { metadata }, colony }: Props) => {
  const enabledExtensionData = useEnabledExtensions();
  const openControlSafeDialog = useDialog(ControlSafeDialog);
  const handleOpenControlSafeDialog = (safe: Safe) =>
    openControlSafeDialog({
      preselectedSafe: safe,
      colony,
      enabledExtensionData,
    });

  if (isEmpty(metadata?.safes)) {
    return null;
  }

  return (
    <div className={styles.main}>
      <Heading appearance={{ size: 'normal', weight: 'bold' }}>
        <FormattedMessage {...MSG.title} />
      </Heading>
      <ul>
        {metadata?.safes?.map((safe) => (
          <li
            key={`${safe.chainId}-${safe.address}`}
            className={styles.safeItem}
          >
            <SafeInfoPopover
              safe={safe}
              openControlSafeDialog={handleOpenControlSafeDialog}
              popperOptions={{
                modifiers: [
                  {
                    name: 'offset',
                    options: {
                      offset: [-5, 15],
                    },
                  },
                ],
                placement: 'left-start',
              }}
            >
              {({ id, isOpen, toggle, ref }) => (
                <button
                  className={classnames(styles.safeItemButton, {
                    [styles.safeItemToggledButton]: isOpen,
                  })}
                  onClick={toggle}
                  aria-describedby={isOpen ? id : undefined}
                  ref={ref}
                  type="button"
                >
                  {safe.name}
                </button>
              )}
            </SafeInfoPopover>
          </li>
        ))}
      </ul>
    </div>
  );
};

ColonySafes.displayName = displayName;

export default ColonySafes;
