import { type Icon as PhosphorIcon } from '@phosphor-icons/react';
import clsx from 'clsx';
import React from 'react';
import { FormattedMessage, type MessageDescriptor } from 'react-intl';

import Heading from '~shared/Heading/index.ts';
import Button from '~v5/shared/Button/index.ts';

const displayName = 'frame.LandingPage';

interface Props {
  icon: PhosphorIcon;
  headingText: MessageDescriptor;
  headingDescription: MessageDescriptor;
  buttonText: MessageDescriptor;
  onClick: () => void;
  itemIndex: number;
  onHover: (itemIndex: number) => void;
  disabled?: boolean;
}

const LandingPageItem = ({
  icon: Icon,
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
        { 'hover:border-blue-400': !disabled, 'text-gray-300': disabled },
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
            size={28}
            className={clsx({
              'group-hover:text-blue-400': !disabled,
            })}
          />
        </div>
        <div>
          <Heading text={headingText} className="text-md font-semibold" />
          <p className="text-sm mt-1">
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
