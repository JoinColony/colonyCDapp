import { Variants } from 'framer-motion';
import React from 'react';
import { FormattedMessage } from 'react-intl';
import { object, string } from 'yup';

// Do not import these from `./hooks` to avoid circular dependencies

import { ACTION, Action } from '~constants/actions.ts';
import { MAX_ANNOTATION_LENGTH } from '~constants/index.ts';
import { useColonyContext } from '~context/ColonyContext.tsx';
import { stripHTMLFromText } from '~utils/elements.ts';
import { formatText } from '~utils/intl.ts';

import { permissionsValidationSchema } from './hooks/usePermissionsValidation.ts';
import { reputationValidationSchema } from './hooks/useReputationValidation.ts';

export const ACTION_TYPE_FIELD_NAME = 'actionType';
export const DECISION_METHOD_FIELD_NAME = 'decisionMethod';

export const useCreateActionTypeNotification = (action: Action | undefined) => {
  const { colony } = useColonyContext();
  const isNativeTokenUnlocked = !!colony.status?.nativeToken?.unlocked;

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
    description: string()
      .transform((description: string | undefined) =>
        typeof description === 'string'
          ? stripHTMLFromText(description)
          : description,
      )
      .max(MAX_ANNOTATION_LENGTH)
      .notRequired(),
  })
  .defined()
  .concat(reputationValidationSchema)
  .concat(permissionsValidationSchema);
