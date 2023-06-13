import { BigNumber } from 'ethers';
import React from 'react';
import { useFormContext } from 'react-hook-form';

import { useAppContext, useColonyContext, useUserReputation } from '~hooks';
import { CustomRadioGroup } from '~shared/Fields';

import { getVotingPanelConfig } from './getVotingPanelConfig';
import { VOTE_FORM_KEY } from './VotingWidget';

const displayName =
  'common.ColonyActions.ActionDetailsPage.DefaultMotion.VotingWidget.VotingPanel';

interface VotingPanelProps {
  motionDomainId: number;
}

const VotingPanel = ({ motionDomainId }: VotingPanelProps) => {
  const { user } = useAppContext();
  const { colony } = useColonyContext();
  const {
    formState: { isSubmitting },
    getValues,
  } = useFormContext();

  const { userReputation } = useUserReputation(
    colony?.colonyAddress ?? '',
    user?.walletAddress ?? '',
    motionDomainId,
  );

  const hasReputationToVote = BigNumber.from(userReputation ?? 0).gt(0);
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
