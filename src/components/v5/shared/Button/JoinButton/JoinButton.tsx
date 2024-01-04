import Lottie from 'lottie-react';
import React, { FC, useState } from 'react';

import { useAppContext, useColonyContext } from '~hooks';
import joinButtonAnimation from '~utils/animations/joinButtonAnimation.json';
import { formatText } from '~utils/intl';

import Button from '../Button';

const displayName = 'v5.JoinButton';

const JoinButton: FC = () => {
  const { wallet, user, walletConnecting, userLoading } = useAppContext();
  const { colonySubscription } = useColonyContext();
  const { handleWatch, canWatch } = colonySubscription;
  const [isButtonClicked, setIsButtonClicked] = useState(false);

  const registeredUser = user && !userLoading;
  const walletConnected = wallet && !walletConnecting;

  const showJoinButton = canWatch && walletConnected && registeredUser;

  const onClick = () => {
    handleWatch();

    if (!showJoinButton) {
      return;
    }

    setIsButtonClicked(true);

    setTimeout(() => {
      setIsButtonClicked(false);
    }, 3000);
  };

  return showJoinButton || isButtonClicked ? (
    <Button
      mode="primarySolidFull"
      size="small"
      onClick={onClick}
      className="ml-3"
    >
      {formatText({ id: isButtonClicked ? 'button.joined' : 'button.join' })}
      {isButtonClicked && (
        <Lottie
          animationData={joinButtonAnimation}
          className="h-4 w-4 ml-1 mb-0.5"
          loop={false}
        />
      )}
    </Button>
  ) : null;
};

JoinButton.displayName = displayName;

export default JoinButton;
