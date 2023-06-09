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

  const ActionButton = isExtensionInstalled ? (
    <Link to={extensionUrl} className={styles.extensionItemButton}>
      {formatMessage({ id: 'button.manage' })}
    </Link>
  ) : (
    <Button mode="primarySolid" isFullSize={isMobile} onClick={handleInstallClick}>
      {formatMessage({ id: 'button.install' })}
    </Button>
  );
  return (
    <div className="flex flex-col items-end sm:block">
      <div className="flex items-center w-full sm:w-auto">
        <div className="flex flex-shrink-0">
          <Icon name={icon} appearance={{ size: 'large' }} />
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between ml-4 w-full gap-6 sm:gap-12">
          <div>
            <div className="flex items-center justify-between sm:justify-start">
              <h5 className="flex items-center text-md font-medium mr-4">
                {formatMessage(title)} <span className="block text-xs text-gray-600 ml-2">v{version}</span>
              </h5>
              <ExtensionStatusBadge mode={status} text={badgeMessage} />
            </div>
            <p className="text-sm text-gray-600 mt-0.5">{formatMessage(description)}</p>
          </div>
          {!isMobile && ActionButton}
        </div>
      </div>
      {isMobile && (
        <div className="w-[calc(100%-3.625rem)] mt-6 ml-3.625rem flex-shrink-0 sm:w-auto sm:ml-4 sm:mt-0">
          {ActionButton}
        </div>
      )}
    </div>
  );
};

ExtensionItem.displayName = displayName;

export default ExtensionItem;
