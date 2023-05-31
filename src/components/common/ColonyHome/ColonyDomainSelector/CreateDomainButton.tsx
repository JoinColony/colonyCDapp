import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import Icon from '~shared/Extensions/Icon';
import { useDialog } from '~shared/Dialog';
import { CreateDomainDialog } from '~common/Dialogs';
import { useColonyContext, useEnabledExtensions } from '~hooks';

import styles from './CreateDomainButton.css';

const displayName = 'common.ColonyHome.ColonyDomainSelector.CreateDomainButton';

const MSG = defineMessages({
  buttonCreateNewDomain: {
    id: `${displayName}.buttonCreateNewDomain`,
    defaultMessage: 'Create new team',
  },
});

const CreateDomainButton = () => {
  const { colony } = useColonyContext();
  const enabledExtensionData = useEnabledExtensions();
  const openCreateDomainDialog = useDialog(CreateDomainDialog);

  const handleClick = () =>
    colony &&
    openCreateDomainDialog({
      colony,
      enabledExtensionData,
    });

  return (
    <div className={styles.container}>
      <button className={styles.main} onClick={handleClick} type="button">
        <div className={styles.buttonIcon}>
          <Icon name="circle-plus" title={MSG.buttonCreateNewDomain} appearance={{ size: 'medium' }} />
        </div>
        <div>
          <FormattedMessage {...MSG.buttonCreateNewDomain} />
        </div>
      </button>
    </div>
  );
};

CreateDomainButton.displayName = displayName;

export default CreateDomainButton;
