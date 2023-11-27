import React from 'react';
import { FormattedMessage, MessageDescriptor } from 'react-intl';
import clsx from 'clsx';

import Icon from '~shared/Icon';
import Heading from '~shared/Heading';
import Button from '~v5/shared/Button';

const displayName = 'frame.LandingPage';

interface Props {
  iconName: string;
  headingText: MessageDescriptor;
  headingDescription: MessageDescriptor;
  buttonText: MessageDescriptor;
  onClick: () => void;
  itemIndex: number;
  onHover: (itemIndex: number) => void;
  disabled?: boolean;
}

const LandingPageItem = ({
  iconName,
  headingText,
  headingDescription,
  buttonText,
  onClick,
  disabled,
  onHover,
  itemIndex,
}: Props) => {
  return (
    <div
      className={clsx(
        'group flex items-center justify-between px-6 py-5 rounded-lg border border-gray-200',
        { 'hover:border-blue-400': !disabled },
      )}
      onMouseEnter={() => onHover(disabled ? 0 : itemIndex)}
      onMouseLeave={() => onHover(0)}
    >
      <div className="flex items-center">
        <div
          className={clsx('flex items-center p-6 mr-4 bg-base-bg rounded-lg', {
            'group-hover:bg-blue-100': !disabled,
          })}
        >
          <Icon
            appearance={{ size: 'medium' }}
            name={iconName}
            className={clsx(
              '[&>svg]:w-7 [&>svg]:h-7 [&>svg]:group-hover:fill-blue-400',
              {
                '[&>svg]:fill-gray-300 [&>svg]:group-hover:fill-gray-300':
                  disabled,
              },
            )}
          />
        </div>
        <div>
          <Heading
            text={headingText}
            className={clsx('text-md font-semibold', {
              'text-gray-900': !disabled,
              'text-gray-300': disabled,
            })}
          />
          <p
            className={clsx('text-sm mt-1', {
              'text-gray-700': !disabled,
              'text-gray-300': disabled,
            })}
          >
            <FormattedMessage {...headingDescription} />
          </p>
        </div>
      </div>
      <Button
        text={buttonText}
        size="small"
        mode="quinary"
        onClick={onClick}
        disabled={disabled}
      />
    </div>
  );
};

LandingPageItem.displayName = displayName;

export default LandingPageItem;
