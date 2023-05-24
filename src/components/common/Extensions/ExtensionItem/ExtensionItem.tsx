import React, { FC } from 'react';
import { useIntl } from 'react-intl';
import { ExtensionItemProps } from './types';
import ExtensionStatusBadge from '../ExtensionStatusBadge-new/ExtensionStatusBadge';
import Button from '~shared/Extensions/Button';
import Icon from '~shared/Icon';
import { useAsyncFunction, useColonyContext, useExtensionData, useMobile } from '~hooks';
import { ActionTypes } from '~redux';
import Link from '~shared/Link/Link';
import styles from './ExtensionItem.module.css';

const ExtensionItem: FC<ExtensionItemProps> = ({
  title,
  description,
  version,
  status,
  badgeText,
  isInstalled,
  icon,
  extensionId,
}) => {
  const { formatMessage } = useIntl();
  const isMobile = useMobile();
  const { colony } = useColonyContext();
  const { extensionData } = useExtensionData(extensionId ?? '');

  const values = {
    colonyAddress: colony?.colonyAddress,
    extensionData,
  };

  // @TODO: Fix install functions
  const submit = ActionTypes.EXTENSION_INSTALL;
  const error = ActionTypes.EXTENSION_INSTALL_ERROR;
  const success = ActionTypes.EXTENSION_INSTALL_SUCCESS;

  const asyncFunction = useAsyncFunction({ submit, error, success });

  const handleClick = async () => {
    try {
      await asyncFunction(values);
    } catch (err) {
      console.error(err);
    }
  };

  const extensionUrl = `/colony/${colony?.name}/extensions/${extensionId}`;

  return (
    <div className="flex items-center">
      <Icon name={icon} appearance={{ size: 'large' }} />
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between ml-4 w-full gap-6 sm:gap-12">
        <div className="max-w-[47.75rem]">
          <div className="flex items-center">
            <h5 className="text-md font-medium mr-2">{title}</h5>
            <p className="text-xs font-medium text-gray-600 mr-2">{version}</p>
            <ExtensionStatusBadge mode={status} text={badgeText} />
          </div>
          <p className="text-sm text-gray-600 mt-1">{description}</p>
        </div>
        {isInstalled && (
          <div>
            <Link to={extensionUrl} className={styles.extensionItemButton}>
              <p className="text-sm font-medium">{formatMessage({ id: 'extension.manageButton' })}</p>
            </Link>
          </div>
        )}
        {!isInstalled && status !== 'coming-soon' && (
          <Button mode="primarySolid" isFullSize={isMobile} onClick={handleClick}>
            <p className="text-sm font-medium">{formatMessage({ id: 'extension.installButton' })}</p>
          </Button>
        )}
      </div>
    </div>
  );
};

export default ExtensionItem;
