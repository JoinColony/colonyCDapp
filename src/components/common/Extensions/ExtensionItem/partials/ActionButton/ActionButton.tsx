import React, { FC } from 'react';
import { useIntl } from 'react-intl';

import { ActionButtonProps } from './types';
import Button from '~v5/shared/Button';
import { useMobile } from '~hooks';
import Link from '~v5/shared/Link';
import styles from './ActionButton.module.css';

const displayName = 'common.Extensions.ExtensionItem.partials.ActionButton';

const ActionButton: FC<ActionButtonProps> = ({
  isExtensionInstalled,
  extensionUrl,
  handleInstallClick,
}) => {
  const { formatMessage } = useIntl();
  const isMobile = useMobile();

  return (
    <>
      {isExtensionInstalled ? (
        <Link to={extensionUrl} className={styles.button}>
          {formatMessage({ id: 'button.manage' })}
        </Link>
      ) : (
        <Button
          mode="primarySolid"
          isFullSize={isMobile}
          onClick={handleInstallClick}
        >
          {formatMessage({ id: 'button.install' })}
        </Button>
      )}
    </>
  );
};

ActionButton.displayName = displayName;

export default ActionButton;
