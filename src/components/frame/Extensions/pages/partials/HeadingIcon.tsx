import React, { type FC } from 'react';
import { useIntl } from 'react-intl';

import { type HeadingIconProps } from './types.ts';

const displayName = 'frame.Extensions.pages.partials.HeadingIcon';

const HeadingIcon: FC<HeadingIconProps> = ({ icon: Icon, name }) => {
  const { formatMessage } = useIntl();

  const title = typeof name === 'string' ? name : name && formatMessage(name);

  return (
    <div className="flex items-center">
      <span className="flex shrink-0">
        <Icon size={34} />
      </span>
      <h4 className="ml-2 heading-4">{title}</h4>
    </div>
  );
};

HeadingIcon.displayName = displayName;

export default HeadingIcon;
