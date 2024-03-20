import Lottie from 'lottie-react';
import React, { type FC, useState } from 'react';

import { useAppContext } from '~context/AppContext/AppContext.ts';
import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
import joinButtonAnimation from '~utils/animations/joinButtonAnimation.json';
import { formatText } from '~utils/intl.ts';

import Button from '../Button.tsx';

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
          className="mb-0.5 ml-1 h-4 w-4"
          loop={false}
        />
      )}
    </Button>
  ) : null;
};

JoinButton.displayName = displayName;

export default JoinButton;
