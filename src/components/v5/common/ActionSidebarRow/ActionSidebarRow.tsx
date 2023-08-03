import React, { FC, PropsWithChildren } from 'react';
import { useIntl } from 'react-intl';

import { ActionSidebarRowProps } from './types';
import Icon from '~shared/Icon';

const ActionSidebarRow: FC<PropsWithChildren<ActionSidebarRowProps>> = ({
  iconName,
  title,
  children,
}) => {
  const { formatMessage } = useIntl();

  return (
    <div className="flex items-center gap-28">
      <div className="flex items-center text-gray-600">
        <Icon name={iconName} appearance={{ size: 'extraTiny' }} />
        <span className="text-md ml-2">{formatMessage(title)}</span>
      </div>
      {children}
    </div>
  );
};

export default ActionSidebarRow;
