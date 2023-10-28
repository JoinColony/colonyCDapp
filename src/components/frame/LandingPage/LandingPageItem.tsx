import React from 'react';
import { FormattedMessage, MessageDescriptor } from 'react-intl';
import clsx from 'clsx';

import Icon from '~shared/Icon';
import Heading from '~shared/Heading';

import Button from '~v5/shared/Button/Button';

const displayName = 'frame.LandingPage';

interface Props {
  iconName: string;
  headingText: MessageDescriptor;
  headingDescription: MessageDescriptor;
  buttonText: MessageDescriptor;
  onClick: () => void;
  disabled?: boolean;
}

const LandingPageItem = ({
  iconName,
  headingText,
  headingDescription,
  buttonText,
  onClick,
  disabled,
}: Props) => {
  return (
    <div className="flex items-center justify-between p-6 rounded-lg border border-gray-200">
      <div className="flex items-center">
        <div className="flex items-center px-[23px] py-[25px] mr-4 bg-base-bg rounded-lg">
          <Icon
            appearance={{ size: 'medium' }}
            name={iconName}
            className={clsx('[&>svg]:w-7 [&>svg]:h-7', {
              '[&>svg]:opacity-20': disabled,
            })}
          />
        </div>
        <div>
          <Heading
            text={headingText}
            className={clsx('text-normal font-semibold', {
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
        mode="primaryOutline"
        onClick={onClick}
        disabled={disabled}
      />
    </div>
  );
};

LandingPageItem.displayName = displayName;

export default LandingPageItem;
