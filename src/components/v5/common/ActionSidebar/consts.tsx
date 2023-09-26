import React from 'react';
import { FormattedMessage } from 'react-intl';
import { ACTION, Action } from '~constants/actions';

export const ACTION_TYPE_FIELD_NAME = 'actionType';

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
