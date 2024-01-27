import { ActionTypes } from '../actionTypes.ts';
import { AllActions } from '../types/actions/index.ts';

export const messageCancel = (id: string): AllActions => ({
  type: ActionTypes.MESSAGE_CANCEL,
  payload: { id },
});

export const messageSign = (id: string) => ({
  type: ActionTypes.MESSAGE_SIGN,
  payload: { id },
  meta: { id },
});
