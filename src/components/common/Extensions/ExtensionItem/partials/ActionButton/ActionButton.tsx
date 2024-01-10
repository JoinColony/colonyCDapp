import React, { FC } from 'react';
import { useIntl } from 'react-intl';

import { useMobile } from '~hooks';
import Button from '~v5/shared/Button';
import Link from '~v5/shared/Link';

import { ActionButtonProps } from './types';

import styles from './ActionButton.module.css';

const displayName = 'common.Extensions.ExtensionItem.partials.ActionButton';

const ActionButton: FC<ActionButtonProps> = ({
  isExtensionInstalled,
  extensionUrl,
  handleNavigateToExtensionDetails,
}) => {
  const { formatMessage } = useIntl();
  const isMobile = useMobile();

  const handleClick = (event: React.MouseEvent) => {
    event.stopPropagation();
    handleNavigateToExtensionDetails();
  };

  return (
    <>
      {isExtensionInstalled ? (
        <Link to={extensionUrl} className={styles.button} onClick={handleClick}>
          {formatMessage({ id: 'button.manage' })}
        </Link>
      ) : (
        <Button
          mode="primarySolid"
          size="small"
          isFullSize={isMobile}
          onClick={handleClick}
        >
          {formatMessage({ id: 'button.install' })}
        </Button>
      )}
    </>
  );
};

ActionButton.displayName = displayName;

export default ActionButton;
