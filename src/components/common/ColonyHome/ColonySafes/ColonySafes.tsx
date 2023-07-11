import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import classnames from 'classnames';

import { isEmpty } from '~utils/lodash';
import SafeInfoPopover from '~shared/SafeInfoPopover';
import Heading from '~shared/Heading';
import { Colony } from '~types';
// import { useDialog } from '~shared/Dialog';
// import ControlSafeDialog from '~dashboard/Dialogs/ControlSafeDialog/ControlSafeDialog';

import styles from './ColonySafes.css';

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

const ColonySafes = ({ colony: { metadata } }: Props) => {
  // const openControlSafeDialog = useDialog(ControlSafeDialog);
  // const handleOpenControlSafeDialog = (safe: Safe) =>
  //   openControlSafeDialog({ preselectedSafe: safe, colony });

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
              // openDialog={handleOpenControlSafeDialog}
              popperOptions={{
                modifiers: [
                  {
                    name: 'offset',
                    options: {
                      offset: [55, 10],
                    },
                  },
                ],
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
