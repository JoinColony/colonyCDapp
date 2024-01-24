import { fromJS } from 'immutable';

import { TransactionStatus } from '~types/graphql';

import { ActionTypes } from '../actionTypes';
import { CORE_MESSAGES_LIST } from '../constants';
import { Message } from '../immutable';
import { CoreMessages, CoreMessagesRecord } from '../state/messages';
import { ReducerType } from '../types/reducer';

const coreMessagesReducer: ReducerType<CoreMessagesRecord> = (
  state = CoreMessages(),
  action,
) => {
  switch (action.type) {
    case ActionTypes.MESSAGE_CREATED: {
      const message = Message(action.payload);
      return state.setIn([CORE_MESSAGES_LIST, message.id], message);
    }
    case ActionTypes.MESSAGE_SIGN: {
      const { id } = action.payload;
      return state.mergeIn(
        [CORE_MESSAGES_LIST, id],
        fromJS({ status: TransactionStatus.Pending }),
      );
    }
    case ActionTypes.MESSAGE_SIGNED: {
      const { id, signature } = action.payload;
      return state.mergeIn(
        [CORE_MESSAGES_LIST, id],
        fromJS({
          signature,
          status: TransactionStatus.Succeeded,
        }),
      );
    }
    case ActionTypes.MESSAGE_ERROR: {
      const { messageId } = action.meta;
      return state.updateIn(
        [CORE_MESSAGES_LIST, messageId, 'status'],
        () => TransactionStatus.Failed,
      );
    }
    case ActionTypes.MESSAGE_CANCEL: {
      const { id } = action.payload;
      return state.deleteIn([CORE_MESSAGES_LIST, id]);
    }
    default:
      return state;
  }
};

export default coreMessagesReducer;
