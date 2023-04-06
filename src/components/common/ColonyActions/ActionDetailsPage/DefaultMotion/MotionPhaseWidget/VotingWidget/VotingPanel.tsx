import React from 'react';
import { useFormContext } from 'react-hook-form';

import { useAppContext } from '~hooks';
import { CustomRadioGroup } from '~shared/Fields';

import { getVotingPanelConfig } from './getVotingPanelConfig';
import { VOTE_FORM_KEY } from './VotingWidget';

const displayName =
  'common.ColonyActions.ActionDetailsPage.DefaultMotion.VotingWidget.VotingPanel';

const VotingPanel = () => {
  const { user } = useAppContext();
  const {
    formState: { isSubmitting },
    getValues,
  } = useFormContext();

  // Wire in...
  const hasReputationToVote = true;
  const vote = getValues(VOTE_FORM_KEY);
  const disabled = !user || !hasReputationToVote || isSubmitting;
  const config = getVotingPanelConfig(vote, disabled);

  return (
    <CustomRadioGroup
      appearance={{ direction: 'vertical' }}
      options={config}
      currentlyCheckedValue={vote}
      name="vote"
      disabled={disabled}
    />
  );
};

VotingPanel.displayName = displayName;

export default VotingPanel;
