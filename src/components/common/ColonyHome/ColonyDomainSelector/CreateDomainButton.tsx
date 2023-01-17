import React from 'react';
import { defineMessages, useIntl } from 'react-intl';

import Icon from '~shared/Icon';
// import { useDialog } from '~core/Dialog';
// import CreateDomainDialog from '~dialogs/CreateDomainDialog';
import { useColonyContext } from '~hooks';
import { Icons } from '~constants';

import styles from './CreateDomainButton.css';

const displayName = 'common.ColonyHome.ColonyDomainSelector.CreateDomainButton';

const MSG = defineMessages({
  buttonCreateNewDomain: {
    id: `${displayName}.buttonCreateNewDomain`,
    defaultMessage: 'Create new team',
  },
});

const CreateDomainButton = () => {
  const { formatMessage } = useIntl();

  const { colony } = useColonyContext();

  // const openCreateDomainDialog = useDialog(CreateDomainDialog);

  // const handleClick = useCallback<MouseEventHandler<HTMLButtonElement>>(
  //   (evt) => {
  //     evt.stopPropagation();
  //     /*
  //      * We don't have, and can't inject all the required props that the component
  //      * is expecting when using it in a wizard
  //      */
  //     // @ts-ignore
  //     return openCreateDomainDialog({
  //       colony,
  //     });
  //   },
  //   [openCreateDomainDialog, colony],
  // );

  const handleClick = () => colony;

  const text = formatMessage(MSG.buttonCreateNewDomain);

  return (
    <div className={styles.container}>
      <button className={styles.main} onClick={handleClick} type="button">
        <div className={styles.buttonIcon}>
          <Icon
            name={Icons.CirclePlus}
            title={text}
            appearance={{ size: 'medium' }}
          />
        </div>
        <div>{text}</div>
      </button>
    </div>
  );
};

CreateDomainButton.displayName = displayName;

export default CreateDomainButton;
