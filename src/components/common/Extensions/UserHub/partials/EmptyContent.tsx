import React, { FC } from 'react';
import { useIntl } from 'react-intl';

import Icon from '~shared/Icon';

const displayName = 'frame.GasStation.EmptyContent';

interface EmptyContentProps {
  contentName: string;
}

const EmptyContent: FC<EmptyContentProps> = ({ contentName }) => {
  const { formatMessage } = useIntl();

  return (
    <div className="flex flex-col items-center justify-center absolute bottom-0 top-0 left-0 right-0">
      <div
        className={`flex items-center justify-center w-[2.375rem] h-[2.375rem] rounded-full
      bg-gray-200 border-[0.375rem] border-gray-50 shrink-0`}
      >
        <Icon name="binoculars" appearance={{ size: 'tiny' }} />
      </div>
      <p className="font-medium text-sm leading-5">
        {formatMessage({ id: 'empty.content.title' }, { contentName })}
      </p>
      <p className="text-xs text-gray-600">
        {formatMessage({ id: 'empty.content.subtitle' }, { contentName })}
      </p>
    </div>
  );
};

EmptyContent.displayName = displayName;

export default EmptyContent;
