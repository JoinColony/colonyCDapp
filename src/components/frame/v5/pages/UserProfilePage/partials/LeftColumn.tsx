import React, { FC } from 'react';
import { useIntl } from 'react-intl';

import { LeftColumnProps } from '../types';

const displayName = 'v5.pages.UserProfilePage.partials.LeftColumn';

const LeftColumn: FC<LeftColumnProps> = ({ fieldTitle, fieldDecription }) => {
  const { formatMessage } = useIntl();

  return (
    <div className="flex flex-col w-[16.375rem]">
      <span className="text-gray-900 text-1 leading-5">
        {formatMessage(fieldTitle)}
      </span>
      <span className="text-gray-600 text-sm">
        {formatMessage(fieldDecription)}
      </span>
    </div>
  );
};

LeftColumn.displayName = displayName;

export default LeftColumn;
