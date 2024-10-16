import { ColonyRole } from '@colony/colony-js';
import { defineMessages } from 'react-intl';

import { ActionTitleKey, registerAction } from '~actions';
import { DecisionMethod } from '~gql';
import {
  CREATED_IN_FIELD_NAME,
  DECISION_METHOD_FIELD_NAME,
  FROM_FIELD_NAME,
} from '~v5/common/ActionSidebar/consts.ts';
import PaymentBuilderForm from '~v5/common/ActionSidebar/partials/forms/core/PaymentBuilderForm/PaymentBuilderForm.tsx';

import { CoreAction } from './types.ts';

const MSG = defineMessages({
  name: {
    id: 'actions.core.CreateExpenditure.name',
    defaultMessage: 'Advanced payment',
  },
  title: {
    id: 'actions.core.CreateExpenditure.title',
    defaultMessage:
      'Payment to {recipientsNumber} {recipientsNumber, plural, one {recipient} other {recipients}} with {tokensNumber} {tokensNumber, plural, one {token} other {tokens}} by {initiator}',
  },
});

registerAction({
  component: PaymentBuilderForm,
  name: MSG.name,
  requiredPermissions: [[ColonyRole.Administration]],
  permissionDomainId: ({ watch }) => {
    const decisionMethod = watch(DECISION_METHOD_FIELD_NAME);
    if (decisionMethod !== DecisionMethod.Reputation) {
      return watch(FROM_FIELD_NAME);
    }
    return watch(CREATED_IN_FIELD_NAME);
  },
  title: MSG.title,
  titleKeys: [
    ActionTitleKey.Initiator,
    ActionTitleKey.RecipientsNumber,
    ActionTitleKey.TokensNumber,
  ],
  type: CoreAction.CreateExpenditure,
});
