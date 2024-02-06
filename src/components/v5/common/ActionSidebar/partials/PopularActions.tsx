import React, { type FC } from 'react';
import { useIntl } from 'react-intl';

import { TextButton } from '~v5/shared/Button/index.ts';

import { type PopularActionsProps } from '../types.ts';

import { POPULAR_ACTIONS } from './consts.tsx';

const displayName = 'v5.common.ActionSidebar.partials.PopularActions';

const PopularActions: FC<PopularActionsProps> = ({ setSelectedAction }) => {
  const { formatMessage } = useIntl();

  return (
    <div className="px-6">
      <h4 className="text-1 pb-2 border-b border-b-gray-200 mb-4">
        {formatMessage({ id: 'actionSidebar.popularActions' })}
      </h4>
      <ul>
        {POPULAR_ACTIONS.map(({ action, text, icon }) => (
          <li className="flex items-center mb-4 last:mb-0" key={action}>
            <TextButton
              text={text}
              icon={icon}
              iconSize={16}
              mode="medium"
              className="text-gray-900 font-normal"
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
