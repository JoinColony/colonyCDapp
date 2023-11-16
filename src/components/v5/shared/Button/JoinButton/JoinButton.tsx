import React, { FC, useState } from 'react';
import Lottie from 'lottie-react';
import useColonySubscription from '~hooks/useColonySubscription';
import { formatText } from '~utils/intl';
import joinButtonAnimation from '~utils/animations/joinButtonAnimation.json';
import Button from '../Button';
import { useShowJoinColonyButton } from './hooks';

const displayName = 'v5.JoinButton';

const JoinButton: FC = () => {
  const {
    showJoinButton,
    setShowJoinButton,
    noRegisteredUser,
    noWalletConnected,
  } = useShowJoinColonyButton();
  const { handleWatch } = useColonySubscription();
  const [isButtonClicked, setIsButtonClicked] = useState(false);

  const onClick = () => {
    handleWatch();

    if (noRegisteredUser || noWalletConnected) {
      return;
    }

    setIsButtonClicked(true);

    setTimeout(() => {
      setIsButtonClicked(false);
      setShowJoinButton(false);
    }, 3000);
  };

  return showJoinButton ? (
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
