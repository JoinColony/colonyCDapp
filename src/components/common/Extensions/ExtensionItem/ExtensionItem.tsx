import React, { FC, useCallback, useMemo, useState } from 'react';
import { useIntl } from 'react-intl';
import { ExtensionItemProps } from './types';
import ExtensionStatusBadge from '../ExtensionStatusBadge-new/ExtensionStatusBadge';
import Button from '~shared/Extensions/Button';
import Icon from '~shared/Icon';
import { useAsyncFunction, useColonyContext, useExtensionData, useMobile } from '~hooks';
import { ActionTypes } from '~redux';
import Link from '~shared/Link/Link';
import styles from './ExtensionItem.module.css';
import { isInstalledExtensionData } from '~utils/extensions';
import { ExtensionStatusBadgeMode } from '../ExtensionStatusBadge-new/types';

const displayName = 'common.Extensions.ExtensionItem';

const ExtensionItem: FC<ExtensionItemProps> = ({ title, description, version, icon, extensionId = '' }) => {
  const { formatMessage } = useIntl();
  const isMobile = useMobile();
  const { colony } = useColonyContext();
  const { extensionData } = useExtensionData(extensionId);
  const [status, setStatus] = useState<ExtensionStatusBadgeMode>();
  const [badgeMessage, setBadgeMessage] = useState<string>('');

  const extensionValues = useMemo(() => {
    return {
      colonyAddress: colony?.colonyAddress,
      extensionData,
    };
  }, [colony?.colonyAddress, extensionData]);

  const submit = ActionTypes.EXTENSION_INSTALL;
  const error = ActionTypes.EXTENSION_INSTALL_ERROR;
  const success = ActionTypes.EXTENSION_INSTALL_SUCCESS;

  const asyncFunction = useAsyncFunction({ submit, error, success });

  const handleClick = useCallback(async () => {
    try {
      await asyncFunction(extensionValues);
    } catch (err) {
      console.error(err);
    }
  }, [asyncFunction, extensionValues]);

  const extensionUrl = `/colony/${colony?.name}/extensions/${extensionId}`;
  const isExtensionInstalled = extensionData && isInstalledExtensionData(extensionData);

  useMemo(() => {
    if (!isExtensionInstalled) {
      setStatus('not-installed');
      setBadgeMessage(formatMessage({ id: 'extensionsPage.notInstalled' }));
    } else if (extensionData?.isDeprecated) {
      setStatus('deprecated');
      setBadgeMessage(formatMessage({ id: 'extensionsPage.deprecated' }));
    } else if (extensionData?.isEnabled) {
      setStatus('enabled');
      setBadgeMessage(formatMessage({ id: 'extensionsPage.enabled' }));
    } else {
      setStatus('disabled');
      setBadgeMessage(formatMessage({ id: 'extensionsPage.disabled' }));
    }
  }, [extensionData, formatMessage, isExtensionInstalled]);

  return (
    <div className="flex items-center">
      <Icon name={icon} appearance={{ size: 'large' }} />
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between ml-4 w-full gap-6 sm:gap-12">
        <div className="max-w-[47.75rem]">
          <div className="flex items-center">
            <h5 className="text-md font-medium mr-2">{formatMessage(title)}</h5>
            <p className="text-xs font-medium text-gray-600 mr-2">v{version}</p>
            <ExtensionStatusBadge mode={status} text={badgeMessage} />
          </div>
          <p className="text-sm text-gray-600 mt-1">{formatMessage(description)}</p>
        </div>
        {isExtensionInstalled && (
          <div>
            <Link to={extensionUrl} className={styles.extensionItemButton}>
              <p className="text-sm font-medium">{formatMessage({ id: 'extension.manageButton' })}</p>
            </Link>
          </div>
        )}
        {!isExtensionInstalled && (
          <Button mode="primarySolid" isFullSize={isMobile} onClick={handleClick}>
            <p className="text-sm font-medium">{formatMessage({ id: 'extension.installButton' })}</p>
          </Button>
        )}
      </div>
    </div>
  );
};

ExtensionItem.displayName = displayName;

export default ExtensionItem;
