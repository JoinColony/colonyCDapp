import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BigNumber } from 'ethers';
import { Id, MotionState as NetworkMotionState } from '@colony/colony-js';

import MaskedAddress from '~shared/MaskedAddress';
import Numeral from '~shared/Numeral';
import { Colony, Expenditure, ExpenditureSlot, ExpenditureStage } from '~types';
import { ExpenditureStatus, useGetMotionStateQuery } from '~gql';
import { ActionButton } from '~shared/Button';
import { ActionTypes } from '~redux';
import { pipe, withMeta } from '~utils/actions';
import { MotionState, getMotionState } from '~utils/colonyMotions';
import { notNull } from '~utils/arrays';
import { motionTags } from '~shared/Tag';

import MotionHistoryItem from './MotionHistoryItem';

import { isMotionInProgress } from '../helpers';

import styles from './ExpenditureStages.module.css';

interface Props {
  colony: Colony;
  expenditure: Expenditure;
  expenditureStages: ExpenditureStage[];
  stagedExpenditureAddress: string | undefined;
  expenditureSlot: ExpenditureSlot;
  isVotingReputationEnabled: boolean;
}

const ExpenditureStagesItem = ({
  colony,
  expenditure,
  expenditureStages,
  stagedExpenditureAddress,
  expenditureSlot,
  isVotingReputationEnabled,
}: Props) => {
  const navigate = useNavigate();
  const transformPayload = pipe(withMeta({ navigate }));

  const expenditureStage = expenditureStages.find(
    (stage) => stage.slotId === expenditureSlot.id,
  );

  const nonZeroPayouts = expenditureSlot.payouts?.filter((payout) =>
    BigNumber.from(payout.amount).gt(0),
  );
  const payloadValues = {
    colonyAddress: colony.colonyAddress,
    expenditure,
    slotId: expenditureSlot.id,
    tokenAddresses: nonZeroPayouts?.map((payout) => payout.tokenAddress) ?? [],
    stagedExpenditureAddress,
    motionDomainId: expenditure.nativeDomainId ?? Id.RootDomain,
  };

  const releaseExpenditureStageMotions =
    expenditure.motions?.items
      .filter(notNull)
      .filter(
        (motion) => motion?.expenditureSlotId === expenditureStage?.slotId,
      )
      .sort((a, b) => Number(a.motionId) - Number(b.motionId)) ?? [];
  const latestReleaseExpenditureStageMotion =
    releaseExpenditureStageMotions.at(-1);

  const { data: latestReleaseExpenditureMotionStateQuery } =
    useGetMotionStateQuery({
      skip: !latestReleaseExpenditureStageMotion,
      variables: {
        input: {
          colonyAddress: colony.colonyAddress,
          databaseMotionId:
            latestReleaseExpenditureStageMotion?.databaseMotionId ?? '',
        },
      },
    });

  const latestReleaseExpenditureStageMotionState =
    latestReleaseExpenditureStageMotion &&
    getMotionState(
      latestReleaseExpenditureMotionStateQuery?.getMotionState ??
        NetworkMotionState.Null,
      latestReleaseExpenditureStageMotion,
    );

  const ForcedTag = motionTags[MotionState.Forced];

  return (
    <li key={expenditureStage?.slotId} className={styles.stageItem}>
      <div className={styles.stage}>
        {expenditureStage ? (
          <div>
            <div>Milestone</div>
            <div>{expenditureStage.name}</div>
          </div>
        ) : (
          <div>No stage details found for this payout.</div>
        )}
        <div>
          <div>Token address</div>
          <div>
            {nonZeroPayouts?.map((payout) => (
              <MaskedAddress
                key={payout.tokenAddress}
                address={payout.tokenAddress}
              />
            ))}
          </div>
        </div>

        <div>
          <div>Amount</div>
          <div>
            {nonZeroPayouts?.map((payout) => (
              <Numeral
                key={payout.tokenAddress}
                value={payout.amount}
                decimals={colony.nativeToken.decimals}
                suffix={colony.nativeToken.symbol}
              />
            ))}
          </div>
        </div>
        {expenditure.status === ExpenditureStatus.Finalized &&
          !expenditureStage?.isReleased &&
          !isMotionInProgress(latestReleaseExpenditureStageMotionState) && (
            <>
              {isVotingReputationEnabled && (
                <ActionButton
                  actionType={ActionTypes.MOTION_RELEASE_EXPENDITURE_STAGE}
                  transform={transformPayload}
                  values={payloadValues}
                >
                  Release (with motion)
                </ActionButton>
              )}
              <ActionButton
                actionType={ActionTypes.RELEASE_EXPENDITURE_STAGE}
                transform={transformPayload}
                values={payloadValues}
              >
                Release (with permissions)
              </ActionButton>
            </>
          )}
        {expenditureStage?.isReleased && (
          <>
            <div>Released</div>
            {latestReleaseExpenditureStageMotionState !== MotionState.Passed &&
              isVotingReputationEnabled && <ForcedTag />}
          </>
        )}
      </div>
      <div>
        {releaseExpenditureStageMotions.map((motion) => (
          <MotionHistoryItem
            key={motion.motionId}
            colony={colony}
            motion={motion}
          />
        ))}
      </div>
    </li>
  );
};

export default ExpenditureStagesItem;
