import { type ActionTypes } from '~redux/actionTypes.ts';

import {
  type ActionTypeWithPayload,
  type UniqueActionType,
  type ErrorActionType,
} from './index.ts';

export type MessageActionTypes =
  | ActionTypeWithPayload<
      ActionTypes.MESSAGE_CREATED,
      { id: string; purpose?: string; message: string; createdAt?: Date }
    >
  | UniqueActionType<ActionTypes.MESSAGE_SIGN, { id: string }, object>
  | UniqueActionType<
      ActionTypes.MESSAGE_SIGNED,
      { id: string; message?: string; signature: string },
      object
    >
  | ErrorActionType<
      ActionTypes.MESSAGE_ERROR,
      { id: string; messageId: string }
    >
  | ActionTypeWithPayload<ActionTypes.MESSAGE_CANCEL, { id: string }>;
