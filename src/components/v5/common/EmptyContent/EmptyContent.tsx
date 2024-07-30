import { ShareNetwork } from '@phosphor-icons/react';
import clsx from 'clsx';
import React, { type FC } from 'react';
import { useIntl } from 'react-intl';

import Button from '~v5/shared/Button/index.ts';

import { type EmptyContentProps } from './types.ts';

const displayName = 'v5.common.EmptyContent';

const EmptyContent: FC<EmptyContentProps> = ({
  icon: Icon,
  title,
  description,
  onClick,
  buttonText,
  withBorder,
  className,
  withoutButtonIcon = false,
  buttonIcon: ButtonIcon = ShareNetwork,
  isDropdown,
}) => {
  const { formatMessage } = useIntl();
  const titleText =
    typeof title === 'string' ? title : title && formatMessage(title);
  const buttonTextFormatted =
    typeof buttonText === 'string'
      ? buttonText
      : buttonText && formatMessage(buttonText);
  const descriptionText =
    typeof description === 'string' ? description : formatMessage(description);

  return (
    <div
      className={clsx(
        className,
        'flex w-full flex-col items-center justify-center p-4 text-center',
        {
          'rounded-lg border border-gray-200': withBorder,
        },
      )}
    >
      <div className="flex flex-col items-center justify-center">
        {Icon && (
          <div className="flex shrink-0 items-center justify-center rounded-full border-[0.375rem] border-gray-50 bg-gray-200 p-1.5">
            <Icon className="fill-gray-600" size={20} />
          </div>
        )}
        {titleText && (
          <h5
            className={clsx('mt-3 text-gray-900', {
              'text-1': !isDropdown,
              'text-3': isDropdown,
            })}
          >
            {titleText}
          </h5>
        )}
        <p
          className={clsx('text-sm text-gray-600', {
            'mt-2 sm:mt-3': !isDropdown,
          })}
        >
          {descriptionText}
        </p>
        {onClick && (
          <Button
            mode="primaryOutline"
            className="mt-4"
            size="small"
            icon={withoutButtonIcon ? undefined : ButtonIcon}
            onClick={onClick}
          >
            {buttonTextFormatted}
          </Button>
        )}
      </div>
    </div>
  );
};

EmptyContent.displayName = displayName;

export default EmptyContent;
