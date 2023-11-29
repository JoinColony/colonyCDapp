import { Extension } from '@colony/colony-js';
import { number, object } from 'yup';
import { BigNumber } from 'ethers';
import React from 'react';

import Numeral from '~shared/Numeral';
import MemberReputation from '~common/Extensions/UserNavigation/partials/MemberReputation';

import { useGetVoterRewardsQuery } from '~gql';
import { useAppContext, useColonyContext, useExtensionData } from '~hooks';
import { useVotingWidgetUpdate } from '~common/ColonyActions/ActionDetailsPage/DefaultMotion/MotionPhaseWidget/VotingWidget';
import { mapPayload } from '~utils/actions';
import { formatText } from '~utils/intl';
import { getSafePollingInterval } from '~utils/queries';
import { OnSuccess } from '~shared/Fields';
import { InstalledExtensionData } from '~types';
import { MotionAction } from '~types/motions';
import { MotionVotePayload } from '~redux/sagas/motions/voteMotion';

import { VotingFormValues } from './types';
import { DescriptionListItem } from './partials/DescriptionList/types';
import { getLocalStorageVoteValue, setLocalStorageVoteValue } from './utils';

export const useVotingStep = (
  actionData: MotionAction,
  startPollingAction: (pollingInterval: number) => void,
  stopPollingAction: () => void,
  transactionId: string,
) => {
  const { colony } = useColonyContext();
  const { nativeToken } = colony || {};
  const { wallet, user } = useAppContext();
  const { motionData } = actionData;
  const {
    motionId,
    voterRecord,
    nativeMotionDomainId,
    rootHash,
    repSubmitted,
    skillRep,
  } = motionData;
  const { hasUserVoted, setHasUserVoted } = useVotingWidgetUpdate(
    voterRecord,
    stopPollingAction,
  );

  const { extensionData } = useExtensionData(Extension.VotingReputation);

  const maxVoteFraction = (extensionData as InstalledExtensionData)?.params
    ?.votingReputation?.maxVoteFraction;
  const thresholdPercent = BigNumber.from(maxVoteFraction ?? '0')
    .mul(100)
    .div(BigNumber.from(10).pow(18))
    .toNumber();
  const currentReputationPercent = BigNumber.from(repSubmitted)
    .mul(100)
    .div(skillRep)
    .toNumber();

  const { data } = useGetVoterRewardsQuery({
    variables: {
      input: {
        voterAddress: user?.walletAddress ?? '',
        colonyAddress: colony?.colonyAddress ?? '',
        nativeMotionDomainId,
        motionId,
        rootHash,
      },
    },
    skip: !user || !colony,
    fetchPolicy: 'cache-and-network',
  });
  const { max: maxReward, min: minReward } = data?.getVoterRewards || {};

  const currentUserVote = getLocalStorageVoteValue(transactionId);

  const transform = mapPayload(
    ({ vote }) =>
      ({
        colonyAddress: colony?.colonyAddress ?? '',
        userAddress: user?.walletAddress,
        vote: Number(vote),
        motionId: BigNumber.from(motionId),
      } as MotionVotePayload),
  );

  const handleSuccess: OnSuccess<VotingFormValues> = (vote, { reset }) => {
    setLocalStorageVoteValue(transactionId, vote.vote);
    setHasUserVoted(true);
    reset();
    startPollingAction(getSafePollingInterval());
  };

  const validationSchema = object()
    .shape({
      vote: number().required(),
    })
    .defined();

  let items: DescriptionListItem[] = [
    {
      key: '1',
      label: formatText({ id: 'motion.votingStep.votingMethod' }),
      value: formatText({ id: 'motion.votingStep.method' }),
    },
  ];

  if (!!wallet && !!user) {
    items = [
      ...items,
      {
        key: '2',
        label: formatText({ id: 'motion.votingStep.teamReputation' }),
        value: (
          <MemberReputation
            colonyAddress={colony?.colonyAddress ?? ''}
            domainId={Number(nativeMotionDomainId)}
            rootHash={rootHash}
            textClassName="text-sm"
            walletAddress={user?.walletAddress ?? ''}
          />
        ),
      },
      {
        key: '3',
        label: formatText({ id: 'motion.votingStep.rewardRange' }),
        value: (
          <div>
            <Numeral
              value={minReward || '0'}
              decimals={nativeToken?.decimals}
            />
            {' - '}
            <Numeral
              value={maxReward || '0'}
              decimals={nativeToken?.decimals}
              suffix={nativeToken?.symbol}
            />
          </div>
        ),
      },
    ];
  }

  return {
    hasUserVoted,
    currentUserVote,
    thresholdPercent,
    currentReputationPercent,
    transform,
    handleSuccess,
    items,
    validationSchema,
  };
};
