import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { MessageType } from '~redux/immutable';
import { messageSign } from '~redux/actionCreators';

interface Props {
  message: MessageType;
}

const displayName = 'frame.GasStation.MessageCardControls';

const MessageCardControls = ({ message: { id } }: Props) => {
  const dispatch = useDispatch();

  /*
   * @NOTE Automatically sign the message
   *
   * Since we're just using Metamask, we won't wait for the user to click the "Confirm"
   * button anymore, we just dispatch the action to sign the message, and the user
   * will deal with _confirm-ing_ the action using Metamask's interface.
   */
  useEffect(() => {
    dispatch(messageSign(id));
  }, [dispatch, id]);

  return null;
};

MessageCardControls.displayName = displayName;

export default MessageCardControls;
