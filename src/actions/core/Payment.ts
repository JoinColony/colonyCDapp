// import { ColonyRole } from '@colony/colony-js';
import { defineMessages } from 'react-intl';

import { ActionTitleKey, registerAction } from '~actions/index.ts';

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
  // requiredPermissions: [
  //   [ColonyRole.Funding, ColonyRole.Arbitration, ColonyRole.Administration],
  // ],
  // permissionDomainId: ({ watch }) => watch('from'),
  title: MSG.title,
  titleKeys: [
    ActionTitleKey.Recipient,
    ActionTitleKey.Amount,
    ActionTitleKey.TokenSymbol,
    ActionTitleKey.Initiator,
  ],
  type: CoreAction.MultiplePayment,
});
