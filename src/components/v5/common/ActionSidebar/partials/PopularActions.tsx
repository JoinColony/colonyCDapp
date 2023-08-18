import React, { FC } from 'react';
import { useIntl } from 'react-intl';

import { TextButton } from '~v5/shared/Button';
import { Actions } from '~constants/actions';
import { PopularActionsProps } from '../types';

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
        <li className="flex items-center mb-4">
          <TextButton
            text={{ id: 'actionSidebar.simplePayment' }}
            iconName="money"
            iconSize="extraSmall"
            mode="medium"
            className="text-gray-600 font-normal"
            onClick={() => setSelectedAction(Actions.SIMPLE_PAYMENT)}
          />
        </li>
        <li className="flex items-center mb-4">
          <TextButton
            text={{ id: 'actionSidebar.userPermission' }}
            iconName="wrench"
            iconSize="extraSmall"
            mode="medium"
            className="text-gray-600 font-normal"
            onClick={() => setSelectedAction(Actions.USER_PERMISSIONS)}
          />
        </li>
        <li className="flex items-center mb-4">
          <TextButton
            text={{ id: 'actionSidebar.transferFunds' }}
            iconName="user-switch"
            iconSize="extraSmall"
            mode="medium"
            className="text-gray-600 font-normal"
            onClick={() => setSelectedAction(Actions.TRANSFER_FUNDS)}
          />
        </li>
        <li className="flex items-center">
          <TextButton
            text={{ id: 'actionSidebar.advancedPayments' }}
            iconName="coins"
            iconSize="extraSmall"
            mode="medium"
            className="text-gray-600 font-normal"
            onClick={() => setSelectedAction(Actions.ADVANCED_PAYMENT)}
          />
        </li>
      </ul>
    </div>
  );
};

PopularActions.displayName = displayName;

export default PopularActions;
