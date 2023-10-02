import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { BigNumber } from 'ethers';
import { Id } from '@colony/colony-js';

import MaskedAddress from '~shared/MaskedAddress';
import Numeral from '~shared/Numeral';
import { Colony, Expenditure, ExpenditureSlot } from '~types';
import { ExpenditureStage, ExpenditureStatus } from '~gql';
import { ActionButton } from '~shared/Button';
import { ActionTypes } from '~redux';
import { pipe, withMeta } from '~utils/actions';

import styles from './ExpenditureStages.module.css';
import { useExpenditureStageStatus } from './helpers';
import { motionTags } from '~shared/Tag';

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
  const { expenditureStageStatus, motionTransactionHash } =
    useExpenditureStageStatus(
      colony.colonyAddress,
      expenditure,
      expenditureStage,
    );
  const ExpenditureStageTag = motionTags[expenditureStageStatus ?? ''];

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

  return (
    <li key={expenditureStage?.slotId} className={styles.stage}>
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
        !expenditureStageStatus && (
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
      {expenditureStage?.isReleased && <div>Released</div>}
      {expenditureStageStatus && isVotingReputationEnabled && (
        <>
          {motionTransactionHash ? (
            <Link to={`/colony/${colony.name}/tx/${motionTransactionHash}`}>
              <ExpenditureStageTag />
            </Link>
          ) : (
            <ExpenditureStageTag />
          )}
        </>
      )}
    </li>
  );
};

export default ExpenditureStagesItem;
