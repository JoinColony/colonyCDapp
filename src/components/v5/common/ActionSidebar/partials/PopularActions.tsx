import React, { FC } from 'react';
import { useIntl } from 'react-intl';

import { TextButton } from '~v5/shared/Button';
import { PopularActionsProps } from '../types';
import { POPULAR_ACTIONS } from './consts';

const displayName = 'v5.common.ActionSidebar.partials.PopularActions';

const PopularActions: FC<PopularActionsProps> = ({ setSelectedAction }) => {
  const { formatMessage } = useIntl();

  return (
    <div className="p-6">
      <h4 className="text-1 pb-2">
        {formatMessage({ id: 'actionSidebar.popularActions' })}
      </h4>
      <div className="divider mb-2" />
      <ul>
        {POPULAR_ACTIONS.map(({ action, text, iconName }) => (
          <li className="flex items-center mb-4" key={action}>
            <TextButton
              text={text}
              iconName={iconName}
              iconSize="extraSmall"
              mode="medium"
              className="text-gray-600 font-normal"
              onClick={() => setSelectedAction(action)}
            />
          </li>
        ))}
      </ul>
    </div>
  );
};

PopularActions.displayName = displayName;

export default PopularActions;
