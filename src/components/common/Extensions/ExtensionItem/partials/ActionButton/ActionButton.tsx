import clsx from 'clsx';
import React, { type FC } from 'react';
import { useIntl } from 'react-intl';

import { usePageThemeContext } from '~context/PageThemeContext/PageThemeContext.ts';
import { useMobile } from '~hooks/index.ts';
import Button from '~v5/shared/Button/index.ts';
import Link from '~v5/shared/Link/index.ts';

import { type ActionButtonProps } from './types.ts';

const displayName = 'common.Extensions.ExtensionItem.partials.ActionButton';

const ActionButton: FC<ActionButtonProps> = ({
  isExtensionInstalled,
  extensionUrl,
  handleNavigateToExtensionDetails,
}) => {
  const { formatMessage } = useIntl();
  const isMobile = useMobile();
  const { isDarkMode } = usePageThemeContext();

  const handleClick = (event: React.MouseEvent) => {
    event.stopPropagation();
    handleNavigateToExtensionDetails();
  };

  return (
    <>
      {isExtensionInstalled ? (
        <Link
          to={extensionUrl}
          className={clsx(
            'flex h-[2.5rem] items-center justify-center rounded-lg border border-gray-300 bg-base-white px-4 py-2.5 text-md font-medium text-gray-700 transition-all duration-normal hover:border-gray-900 hover:bg-gray-900 hover:!text-base-white disabled:text-gray-300',
            {
              'text-gray-900': isDarkMode,
            },
          )}
        >
          {formatMessage({ id: 'button.manage' })}
        </Link>
      ) : (
        <Button mode="primarySolid" isFullSize={isMobile} onClick={handleClick}>
          {formatMessage({ id: 'button.install' })}
        </Button>
      )}
    </>
  );
};

ActionButton.displayName = displayName;

export default ActionButton;
