import React, { FC } from 'react';
import { useIntl } from 'react-intl';

import { ExtensionItemProps } from './types';
import ExtensionStatusBadge from '~v5/common/Pills/ExtensionStatusBadge';
import Icon from '~shared/Icon';
import { useMobile } from '~hooks';
import { useExtensionItem } from './hooks';
import ActionButton from './partials/ActionButton';
import Link from '~v5/shared/Link';

const displayName = 'common.Extensions.ExtensionItem';

const ExtensionItem: FC<ExtensionItemProps> = ({
  title,
  description,
  version,
  icon,
  extensionId,
}) => {
  const { formatMessage } = useIntl();
  const isMobile = useMobile();
  const {
    badgeMessage,
    extensionUrl,
    isExtensionInstalled,
    status,
    handleNavigateToExtensionDetails,
  } = useExtensionItem(extensionId);

  const button = (
    <ActionButton
      isExtensionInstalled={!!isExtensionInstalled}
      handleNavigateToExtensionDetails={handleNavigateToExtensionDetails}
      extensionUrl={extensionUrl}
    />
  );

  return (
    <div className="flex flex-col items-end sm:block">
      <div className="flex items-center w-full sm:w-auto">
        <div className="flex shrink-0">
          <Icon name={icon} appearance={{ size: 'extraBig' }} />
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between ml-4 w-full gap-6 sm:gap-12">
          <Link to={extensionUrl}>
            <div className="flex items-center justify-between sm:justify-start">
              <h5 className="flex items-center text-1 mr-4 content-end">
                {formatMessage(title)}
                <span className="block text-xs text-gray-600 ml-2">
                  v{version}
                </span>
              </h5>
              <ExtensionStatusBadge mode={status} text={badgeMessage} />
            </div>
            <p className="text-sm text-gray-600 mt-0.5">
              {formatMessage(description)}
            </p>
          </Link>
          {!isMobile && button}
        </div>
      </div>
      {isMobile && (
        <div className="w-[calc(100%-3.625rem)] mt-6 ml-3.625rem shrink-0 sm:w-auto sm:ml-4 sm:mt-0">
          {button}
        </div>
      )}
    </div>
  );
};

ExtensionItem.displayName = displayName;

export default ExtensionItem;
