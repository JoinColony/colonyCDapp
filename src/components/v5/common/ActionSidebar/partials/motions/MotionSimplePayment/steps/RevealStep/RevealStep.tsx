import React, { FC } from 'react';

import { BigNumber } from 'ethers';
import clsx from 'clsx';
import { RevealStepProps } from './types';
import CardWithStatusText from '~v5/shared/CardWithStatusText';
import ProgressBar from '~v5/shared/ProgressBar';
import { formatText } from '~utils/intl';
import Button from '~v5/shared/Button';
import { ActionForm, OnSuccess } from '~shared/Fields';
import { ActionTypes } from '~redux';
import { useGetVoterRewardsQuery } from '~gql';
import { useAppContext, useColonyContext } from '~hooks';
import { useRevealWidgetUpdate } from '~common/ColonyActions/ActionDetailsPage/DefaultMotion/MotionPhaseWidget/RevealWidget/useRevealWidgetUpdate';
import StatusText from '~v5/shared/StatusText';
import Numeral from '~shared/Numeral';
import { mapPayload } from '~utils/actions';
import { RevealMotionPayload } from '~redux/sagas/motions/revealVoteMotion';
import RevealInformationList from './partials/RevealInformationList';

const displayName =
  'v5.common.ActionSidebar.partials.motions.MotionSimplePayment.steps.RevealStep';

const RevealStep: FC<RevealStepProps> = ({
  motionData,
  startPollingAction,
  stopPollingAction,
}) => {
  const { nativeMotionDomainId, voterRecord, rootHash, motionId } = motionData;
  const { user } = useAppContext();
  const { colony } = useColonyContext();
  const { nativeToken } = colony || {};
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

  const { reward: voterReward } = data?.getVoterRewards || {};

  const { userVoteRevealed, setUserVoteRevealed } = useRevealWidgetUpdate(
    voterRecord,
    stopPollingAction,
  );
  const transform = mapPayload(
    () =>
      ({
        colonyAddress: colony?.colonyAddress,
        userAddress: user?.walletAddress ?? '',
        motionId: BigNumber.from(motionId),
      } as RevealMotionPayload),
  );

  const handleSuccess: OnSuccess<Record<string, any>> = (_, { reset }) => {
    reset();
    startPollingAction(1000);
    setUserVoteRevealed(true);
  };

  const voters = voterRecord.map((voter) => ({
    address: voter.address,
    hasRevealed: voter.vote !== null,
  }));

  return (
    <CardWithStatusText
      statusTextSectionProps={{
        status: 'info',
        children: formatText({ id: 'motion.revealStep.statusText' }),
        textClassName: 'text-4',
        content: (
          <div className="mt-1 flex flex-col gap-2">
            <ProgressBar
              progress={0}
              additionalText={formatText({
                id: 'motion.revealStep.additionalText',
              })}
            />
            <StatusText
              status="warning"
              textClassName="text-4 text-gray-900"
              iconAlignment="top"
            >
              {formatText({ id: 'motion.revealStep.warning' })}
            </StatusText>
          </div>
        ),
      }}
      sections={[
        {
          key: '1',
          content: (
            <ActionForm
              actionType={ActionTypes.MOTION_REVEAL_VOTE}
              transform={transform}
              onSuccess={handleSuccess}
            >
              <div className={clsx({ 'mb-6': !userVoteRevealed })}>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <h4 className="text-2">
                    {formatText({ id: 'motion.revealStep.title' })}
                  </h4>
                  support
                </div>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm text-gray-600">
                    {formatText({ id: 'motion.revealStep.rewards' })}
                  </span>
                  <span className="text-sm">
                    <Numeral
                      value={voterReward || '0'}
                      decimals={nativeToken?.decimals}
                      suffix={nativeToken?.symbol}
                    />
                  </span>
                </div>
              </div>
              {!userVoteRevealed && (
                <Button
                  mode="primarySolid"
                  type="submit"
                  isFullSize
                  text={formatText({ id: 'motion.revealStep.submit' })}
                />
              )}
            </ActionForm>
          ),
        },
      ]}
      footer={<RevealInformationList items={voters} />}
    />
  );
};

RevealStep.displayName = displayName;

export default RevealStep;
