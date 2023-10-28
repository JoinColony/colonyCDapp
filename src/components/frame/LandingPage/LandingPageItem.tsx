import React from 'react';
import { FormattedMessage, MessageDescriptor } from 'react-intl';

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
}

const LandingPageItem = ({
  iconName,
  headingText,
  headingDescription,
  buttonText,
  onClick,
}: Props) => {
  return (
    <div className="flex items-center justify-between p-6 rounded-lg border border-gray-200">
      <div className="flex items-center">
        <div className="flex items-center px-[23px] py-[25px] mr-4 bg-base-bg rounded-lg">
          <Icon
            appearance={{ size: 'medium' }}
            name={iconName}
            className="[&>svg]:w-7 [&>svg]:h-7"
          />
        </div>
        <div>
          <Heading
            text={headingText}
            className="text-normal font-semibold text-gray-900"
          />
          <p className="text-sm text-gray-700 mt-1">
            <FormattedMessage {...headingDescription} />
          </p>
        </div>
      </div>
      <Button text={buttonText} mode="primaryOutline" onClick={onClick} />
    </div>
  );
};

LandingPageItem.displayName = displayName;

export default LandingPageItem;
