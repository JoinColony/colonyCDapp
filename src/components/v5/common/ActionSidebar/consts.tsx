import { boolean, object, string } from 'yup';
import { Variants } from 'framer-motion';
import React from 'react';
import { FormattedMessage } from 'react-intl';

import { ACTION, Action } from '~constants/actions';
import { formatText } from '~utils/intl';
import { useColonyContext } from '~hooks';

// Do not change this import to './hooks' because it will cause a circular dependency
import { DecisionMethod } from './hooks/useDecisionMethods';

export const ACTION_TYPE_FIELD_NAME = 'actionType';
export const DECISION_METHOD_FIELD_NAME = 'decisionMethod';

export const useCreateActionTypeNotification = (action: Action | undefined) => {
  const { colony } = useColonyContext();
  const isNativeTokenUnlocked = !!colony?.status?.nativeToken?.unlocked;

  if (!action) {
    return undefined;
  }

  switch (action) {
    case ACTION.UNLOCK_TOKEN:
      return (
        <FormattedMessage
          id={
            isNativeTokenUnlocked
              ? 'actionSidebar.unlocked.token'
              : 'actionSidebar.unlock.token.error'
          }
        />
      );
    case ACTION.ENTER_RECOVERY_MODE:
      return <FormattedMessage id="actionSidebar.enterRecoveryMode.error" />;
    default:
      return undefined;
  }
};

export const useCreateActionTypeNotificationHref = (
  action: Action | undefined,
) => {
  if (!action) {
    return undefined;
  }

  switch (action) {
    case ACTION.UNLOCK_TOKEN:
      return 'https://docs.colony.io/use/managing-funds/unlock-token/';
    default:
      return undefined;
  }
};

export const actionSidebarAnimation: Variants = {
  hidden: {
    x: '100%',
  },
  visible: {
    x: 0,
  },
};

export const ACTION_BASE_VALIDATION_SCHEMA = object()
  .shape({
    title: string()
      .required(formatText({ id: 'errors.title.required' }))
      .max(60, ({ max, value }) =>
        formatText(
          { id: 'errors.title.maxLength' },
          {
            maxLength: max,
            currentLength: value?.length || 0,
          },
        ),
      ),
    domainHasReputation: boolean().when(DECISION_METHOD_FIELD_NAME, {
      is: DecisionMethod.Reputation,
      then: boolean().oneOf([true], 'No reputation in team'), // @NOTE: This message will not be shown in the UI
    }),
    userHasPermissions: boolean().when(DECISION_METHOD_FIELD_NAME, {
      is: DecisionMethod.Permissions,
      then: boolean().oneOf([true], 'Missing permissions'), // @NOTE: This message will not be shown in the UI
    }),
  })
  .defined();
