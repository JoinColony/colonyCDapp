import React, { type FC } from 'react';
import { useIntl } from 'react-intl';

import { useMobile } from '~hooks/index.ts';
import ExtensionStatusBadge from '~v5/common/Pills/ExtensionStatusBadge/index.ts';
import Link from '~v5/shared/Link/index.ts';

import { useExtensionItem } from './hooks.ts';
import ActionButton from './partials/ActionButton/index.ts';
import { type ExtensionItemProps } from './types.ts';

const displayName = 'common.Extensions.ExtensionItem';

const ExtensionItem: FC<ExtensionItemProps> = ({
  title,
  description,
  version,
  icon: Icon,
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
      <div className="flex flex-col sm:flex-row items-center w-full gap-6 sm:gap-12">
        <Link
          to={extensionUrl}
          className="flex flex-1 flex-row items-start w-full"
        >
          <div className="flex shrink-0">
            <Icon size={34} />
          </div>
          <div className="flex flex-1 flex-col items-start ml-4">
            <div className="flex items-center justify-start sm:justify-between w-full sm:w-auto">
              <h5 className="flex items-center text-1 mr-4 content-end">
                {formatMessage(title)}
                <span className="block text-xs text-gray-600 ml-2">
                  v{version}
                </span>
              </h5>
              <ExtensionStatusBadge mode={status} text={badgeMessage} />
            </div>
            <p className="text-md text-gray-600 mt-1.5">
              {formatMessage(description)}
            </p>
          </div>
        </Link>
        {!isMobile && button}
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
