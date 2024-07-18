import React, { type FC } from 'react';
import { useIntl } from 'react-intl';

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
      <div className="flex w-full flex-col items-center gap-6 sm:flex-row sm:gap-12">
        <Link
          to={extensionUrl}
          className="flex w-full flex-1 flex-row items-start"
        >
          <div className="flex shrink-0">
            <Icon size={34} />
          </div>
          <div className="ml-4 flex flex-1 flex-col items-start">
            <div className="flex w-full items-center justify-start sm:w-auto sm:justify-between">
              <h5 className="mr-4 flex content-end items-center text-1">
                {formatMessage(title)}
                <span className="ml-2 block text-xs text-gray-600">
                  v{version}
                </span>
              </h5>
              <ExtensionStatusBadge mode={status} text={badgeMessage} />
            </div>
            <p className="mt-1.5 text-md text-gray-600">
              {formatMessage(description)}
            </p>
          </div>
        </Link>
        <div className="ml-[3.125rem] self-stretch sm:ml-0 sm:self-auto">
          {button}
        </div>
      </div>
      {/* {isMobile && (
        <div className="ml-3.625rem mt-6 w-[calc(100%-3.625rem)] shrink-0 sm:ml-4 sm:mt-0 sm:w-auto">
          {button}
        </div>
      )} */}
    </div>
  );
};

ExtensionItem.displayName = displayName;

export default ExtensionItem;
