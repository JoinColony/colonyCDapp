import React, { FC } from 'react';
import { useIntl } from 'react-intl';

import { LeftColumnProps } from '../types';

const displayName = 'v5.pages.UserProfilePage.partials.LeftColumn';

const LeftColumn: FC<LeftColumnProps> = ({ fieldTitle, fieldDescription }) => {
  const { formatMessage } = useIntl();

  return (
    <div className="flex flex-col md:w-[16.375rem]">
      <span className="text-1 leading-5">{formatMessage(fieldTitle)}</span>
      <span className="text-gray-600 text-sm">
        {formatMessage(fieldDescription)}
      </span>
    </div>
  );
};

LeftColumn.displayName = displayName;

export default LeftColumn;
