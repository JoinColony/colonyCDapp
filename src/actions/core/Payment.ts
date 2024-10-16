import { ColonyRole } from '@colony/colony-js';
import { defineMessages } from 'react-intl';

import { ActionTitleKey, registerAction } from '~actions';
import { DecisionMethod } from '~gql';
import {
  CREATED_IN_FIELD_NAME,
  DECISION_METHOD_FIELD_NAME,
  FROM_FIELD_NAME,
} from '~v5/common/ActionSidebar/consts.ts';

import { CoreAction } from './types.ts';

const MSG = defineMessages({
  name: {
    id: 'actions.core.MultiplePayment.name',
    defaultMessage: 'Simple payment',
  },
  title: {
    id: 'actions.core.MultiplePayment.title',
    defaultMessage: 'Pay {recipient} {amount} {tokenSymbol} by {initiator}',
  },
});

registerAction({
  name: MSG.name,
  requiredPermissions: [
    [ColonyRole.Funding, ColonyRole.Arbitration, ColonyRole.Administration],
  ],
  permissionDomainId: ({ watch }) => {
    const decisionMethod = watch(DECISION_METHOD_FIELD_NAME);
    if (decisionMethod !== DecisionMethod.Reputation) {
      return watch(FROM_FIELD_NAME);
    }
    return watch(CREATED_IN_FIELD_NAME);
  },
  title: MSG.title,
  titleKeys: [
    ActionTitleKey.Recipient,
    ActionTitleKey.Amount,
    ActionTitleKey.TokenSymbol,
    ActionTitleKey.Initiator,
  ],
  type: CoreAction.Payment,
});
