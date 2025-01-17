import { Extension } from '@colony/colony-js';
import { BigNumber } from 'ethers';
import React, { useEffect, useMemo, useState } from 'react';
import { number, object } from 'yup';

import MemberReputation from '~common/Extensions/UserNavigation/partials/MemberReputation/index.ts';
import { useAppContext } from '~context/AppContext/AppContext.ts';
import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
import { useGetVoterRewardsQuery } from '~gql';
import useExtensionData from '~hooks/useExtensionData.ts';
import { type MotionVotePayload } from '~redux/sagas/motions/voteMotion.ts';
import { type OnSuccess } from '~shared/Fields/index.ts';
import Numeral from '~shared/Numeral/index.ts';
import { type InstalledExtensionData } from '~types/extensions.ts';
import { type VoterRecord } from '~types/graphql.ts';
import { getMotionAssociatedActionId, mapPayload } from '~utils/actions.ts';
import { MotionVote } from '~utils/colonyMotions.ts';
import { formatText } from '~utils/intl.ts';
import { type ICompletedMotionAction } from '~v5/common/ActionSidebar/partials/Motions/types.ts';

import { type DescriptionListItem } from './partials/DescriptionList/types.ts';
import { type VotingFormValues, VotingRewardsSections } from './types.ts';
import {
  getLocalStorageVoteValue,
  setLocalStorageVoteValue,
} from './utils.tsx';

const useVotingWidgetUpdate = (voterRecord: VoterRecord[]) => {
  const { user } = useAppContext();
  const currentVotingRecord = voterRecord.find(
    ({ address }) => address === user?.walletAddress,
  );

  const [prevRecord, setPrevRecord] = useState(currentVotingRecord);
  const [hasUserVoted, setHasUserVoted] = useState(!!currentVotingRecord);

  useEffect(() => {
    if (currentVotingRecord && !hasUserVoted) {
      setHasUserVoted(true);
    }
  }, [currentVotingRecord, hasUserVoted]);

  useEffect(() => {
    if (!user) {
      setHasUserVoted(false);
    } else {
      setHasUserVoted(!!currentVotingRecord);
    }
  }, [user, currentVotingRecord]);

  // if user's vote count increased, db has been updated, stop polling
  useEffect(() => {
    if (currentVotingRecord?.voteCount !== prevRecord?.voteCount) {
      setPrevRecord(currentVotingRecord);
    }
  }, [currentVotingRecord, prevRecord]);

  return { hasUserVoted, setHasUserVoted };
};

export const useVotingStep = ({
  action,
  motionData,
}: ICompletedMotionAction) => {
  const {
    colony: { colonyAddress, nativeToken },
  } = useColonyContext();
  const { wallet, user } = useAppContext();
  const { rootHash, transactionHash } = action;
  const {
    motionId,
    voterRecord,
    nativeMotionDomainId,
    repSubmitted,
    skillRep,
  } = motionData;
  const { hasUserVoted, setHasUserVoted } = useVotingWidgetUpdate(voterRecord);

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
        colonyAddress,
        nativeMotionDomainId,
        motionId,
        rootHash,
      },
    },
    skip: !user,
    fetchPolicy: 'cache-and-network',
  });
  const { max: maxReward, min: minReward } = data?.getVoterRewards || {};

  const [currentUserVote, setCurrentUserVote] = useState<MotionVote | null>(
    getLocalStorageVoteValue(transactionHash),
  );

  const associatedActionId = getMotionAssociatedActionId(action);

  const transform = useMemo(
    () =>
      mapPayload(
        ({ vote }) =>
          ({
            associatedActionId,
            colonyAddress,
            userAddress: user?.walletAddress,
            vote: Number(vote),
            motionId: BigNumber.from(motionId),
          }) as MotionVotePayload,
      ),
    [associatedActionId, colonyAddress, user?.walletAddress, motionId],
  );

  const getChangedVote = () => {
    let changedVote = MotionVote.Yay;

    if (currentUserVote === MotionVote.Yay) {
      changedVote = MotionVote.Nay;
    }

    return changedVote;
  };

  const handleSuccess: OnSuccess<VotingFormValues> = ({ vote }, { reset }) => {
    setLocalStorageVoteValue(transactionHash, vote);
    setCurrentUserVote(vote);
    setHasUserVoted(true);
    reset();
  };

  const validationSchema = object()
    .shape({
      vote: number().oneOf([MotionVote.Nay, MotionVote.Yay]).required(),
    })
    .defined();

  const handleChangeVoteSuccess = () => {
    const changedVote = getChangedVote();
    setLocalStorageVoteValue(transactionHash, changedVote);
    setCurrentUserVote(changedVote);
    setHasUserVoted(true);
  };

  const getChangeVotePayload = (): MotionVotePayload => {
    const changedVote = getChangedVote();

    return {
      associatedActionId,
      colonyAddress,
      userAddress: user?.walletAddress || '',
      vote: Number(changedVote),
      motionId: BigNumber.from(motionId),
    };
  };

  let items: DescriptionListItem[] = [
    {
      key: VotingRewardsSections.VotingMethod,
      label: formatText({ id: 'motion.votingStep.votingMethod' }),
      value: formatText({ id: 'motion.votingStep.method' }),
    },
  ];

  if (!!wallet && !!user) {
    items = [
      ...items,
      {
        key: VotingRewardsSections.TeamReputation,
        label: formatText({ id: 'motion.votingStep.teamReputation' }),
        value: (
          <MemberReputation
            colonyAddress={colonyAddress}
            domainId={Number(nativeMotionDomainId)}
            rootHash={rootHash}
            textClassName="text-sm"
            walletAddress={user?.walletAddress ?? ''}
            hideOnMobile={false}
          />
        ),
      },
      {
        key: VotingRewardsSections.RewardRange,
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
              suffix={` ${nativeToken?.symbol}`}
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
    handleChangeVoteSuccess,
    getChangeVotePayload,
  };
};
