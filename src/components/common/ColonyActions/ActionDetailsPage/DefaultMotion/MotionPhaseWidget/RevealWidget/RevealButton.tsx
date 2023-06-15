import React from 'react';

import { useAppContext } from '~hooks';
import Button from '~shared/Button';

import { formatText } from '~utils/intl';

import styles from './RevealButton.css';

const displayName = 'common.ColonyActions.DefaultMotion.RevealWidget';

interface RevealButtonProps {
  hasUserVoted: boolean;
  userVoteRevealed: boolean;
}

const RevealButton = ({
  hasUserVoted,
  userVoteRevealed,
}: RevealButtonProps) => {
  const { user } = useAppContext();

  return (
    <div className={styles.main}>
      <Button
        appearance={{ theme: 'primary', size: 'medium' }}
        text={formatText({
          id: userVoteRevealed ? 'button.revealed' : 'button.reveal',
        })}
        disabled={!user || userVoteRevealed || !hasUserVoted}
        type="submit"
        dataTest="revealButton"
      />
    </div>
  );
};

RevealButton.displayName = displayName;

export default RevealButton;
