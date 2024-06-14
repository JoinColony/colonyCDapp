import { type Icon as PhosphorIcon } from '@phosphor-icons/react';
import clsx from 'clsx';
import React, { type PropsWithChildren } from 'react';
import { FormattedMessage, type MessageDescriptor } from 'react-intl';

import Heading from '~shared/Heading/index.ts';

const displayName = 'frame.LandingPage';

interface Props extends PropsWithChildren {
  icon: PhosphorIcon;
  headingText: MessageDescriptor;
  headingDescription: MessageDescriptor;
  disabled?: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

const LandingPageItem = ({
  icon: Icon,
  headingText,
  headingDescription,
  disabled,
  onMouseEnter,
  onMouseLeave,
  children,
}: Props) => {
  return (
    <div
      className={clsx(
        'group flex items-center justify-between rounded-lg border border-gray-200 px-6 py-5',
        { 'hover:border-blue-400': !disabled, 'text-gray-300': disabled },
      )}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div className="flex w-full items-start sm:items-center">
        <div
          className={clsx('mr-4 flex items-center rounded-lg bg-base-bg p-6', {
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
        <div className="flex w-full flex-col items-center gap-3 md:flex-row md:gap-4">
          <div className="w-full">
            <Heading text={headingText} className="text-md font-semibold" />
            <p className="mt-1 text-sm">
              <FormattedMessage {...headingDescription} />
            </p>
          </div>
          <div className="w-full md:w-auto">{children}</div>
        </div>
      </div>
    </div>
  );
};

LandingPageItem.displayName = displayName;

export default LandingPageItem;
