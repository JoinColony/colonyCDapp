import React from 'react';
import { useFormContext } from 'react-hook-form';

import { useAppContext } from '~hooks';
import Button from '~shared/Button';
import { formatText } from '~utils/intl';

import { VOTE_FORM_KEY } from './VotingWidget';

const displayName =
  'common.ColonyActions.ActionDetailsPage.DefaultMotion.VotingWidget.VoteButton';

interface VoteButtonProps {
  hasReputationToVote: boolean;
  hasUserVoted: boolean;
}
const VoteButton = ({ hasReputationToVote, hasUserVoted }: VoteButtonProps) => {
  const { user } = useAppContext();
  const {
    formState: { isValid, isSubmitting },
    getValues,
  } = useFormContext();

  const vote = getValues(VOTE_FORM_KEY);

  return (
    <Button
      appearance={{ theme: 'primary', size: 'medium' }}
      text={formatText({
        id: hasUserVoted ? 'button.changeVote' : 'button.vote',
      })}
      disabled={
        !isValid ||
        !user ||
        vote === undefined ||
        !hasReputationToVote ||
        isSubmitting
      }
      type="submit"
      loading={isSubmitting}
      dataTest="voteButton"
    />
  );
};

VoteButton.displayName = displayName;

export default VoteButton;
