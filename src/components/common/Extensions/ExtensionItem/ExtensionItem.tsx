import React, { FC } from 'react';
import { useIntl } from 'react-intl';
import { ExtensionItemProps } from './types';
import ExtensionStatusBadge from '~common/Extensions/ExtensionStatusBadge';
import Button from '~shared/Extensions/Button';
import Icon from '~shared/Icon';
import { useMobile } from '~hooks';
import Link from '~shared/Extensions/Link';
import styles from './ExtensionItem.module.css';
import { useExtensionItem } from './hooks';

const displayName = 'common.Extensions.ExtensionItem';

const ExtensionItem: FC<ExtensionItemProps> = ({ title, description, version, icon, extensionId = '' }) => {
  const { formatMessage } = useIntl();
  const isMobile = useMobile();
  const { badgeMessage, extensionUrl, handleInstallClick, isExtensionInstalled, status } =
    useExtensionItem(extensionId);

  return (
    <div className="flex items-center flex-shrink-0">
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
          <Button mode="primarySolid" isFullSize={isMobile} onClick={handleInstallClick}>
            <p className="text-sm font-medium">{formatMessage({ id: 'extension.installButton' })}</p>
          </Button>
        )}
      </div>
    </div>
  );
};

ExtensionItem.displayName = displayName;

export default ExtensionItem;
