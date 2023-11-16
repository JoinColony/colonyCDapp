import { object, string } from 'yup';
import { Variants } from 'framer-motion';
import React from 'react';
import { FormattedMessage } from 'react-intl';
import { ACTION, Action } from '~constants/actions';
import { formatText } from '~utils/intl';

export const ACTION_TYPE_FIELD_NAME = 'actionType';
export const DECISION_METHOD_FIELD_NAME = 'decisionMethod';

export const ACTION_TYPE_NOTIFICATION: Partial<
  Record<Action, React.ReactNode>
> = {
  [ACTION.UNLOCK_TOKEN]: (
    <FormattedMessage id="actionSidebar.unlock.token.error" />
  ),
  [ACTION.ENTER_RECOVERY_MODE]: (
    <FormattedMessage id="actionSidebar.enterRecoveryMode.error" />
  ),
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
  })
  .defined();
