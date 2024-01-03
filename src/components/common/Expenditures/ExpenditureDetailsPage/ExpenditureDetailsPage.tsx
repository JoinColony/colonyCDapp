import { Id, MotionState } from '@colony/colony-js';
import React from 'react';
import { Link, useParams } from 'react-router-dom';

import {
  ColonyActionType,
  ExpenditureType,
  useGetExpenditureQuery,
  useGetMotionStateQuery,
} from '~gql';
import { useColonyContext } from '~hooks';
import { Heading3 } from '~shared/Heading';
import { motionTags } from '~shared/Tag';
import { notNull } from '~utils/arrays';
import { getMotionState } from '~utils/colonyMotions';
import { getExpenditureDatabaseId } from '~utils/databaseId';
import { findDomainByNativeId } from '~utils/domains';
import { boolToYesNo } from '~utils/strings';

import CancelStakedExpenditureButton from '../StakedExpenditure/CancelStakedExpenditureButton';
import ReclaimStakeButton from '../StakedExpenditure/ReclaimStakeButton';

import CancelDraftExpenditureButton from './CancelDraftExpenditureButton';
import ExpenditureAdvanceButton from './ExpenditureAdvanceButton';
import ExpenditureBalances from './ExpenditureBalances';
import ExpenditurePayouts from './ExpenditurePayouts';
import ExpenditureStages from './ExpenditureStages';
import { hasMotionFailed, isMotionInProgress } from './helpers';

import styles from './ExpenditureDetailsPage.module.css';

const ExpenditureDetailsPage = () => {
  const { expenditureId } = useParams();

  const { colony } = useColonyContext();
  const { colonyAddress = '' } = colony || {};
  const { data, loading } = useGetExpenditureQuery({
    variables: {
      expenditureId: getExpenditureDatabaseId(
        colonyAddress,
        Number(expenditureId),
      ),
    },
    skip: !expenditureId || !colony,
  });
  const expenditure = data?.getExpenditure;

  const expenditureFundingMotions =
    expenditure?.motions?.items
      .filter(notNull)
      .filter(
        ({ action }) => action?.type === ColonyActionType.FundExpenditureMotion,
      )
      .sort((a, b) => Number(a.motionId) - Number(b.motionId)) ?? [];

  const expenditureCancelMotions =
    expenditure?.motions?.items
      .filter(notNull)
      .filter(
        ({ action }) =>
          action?.type === ColonyActionType.CancelStakedExpenditureMotion,
      )
      .sort((a, b) => Number(a.motionId) - Number(b.motionId)) ?? [];

  const latestFundingMotion = expenditureFundingMotions.at(-1);
  const latestCancelMotion = expenditureCancelMotions.at(-1);

  const latestExpenditureFundingMotionHash: string | undefined =
    latestFundingMotion?.transactionHash;
  const latestExpenditureCancelMotionHash: string | undefined =
    latestCancelMotion?.transactionHash;

  const { data: fundingMotionStateQuery } = useGetMotionStateQuery({
    skip: !latestFundingMotion,
    variables: {
      input: {
        colonyAddress,
        databaseMotionId: latestFundingMotion?.databaseMotionId ?? '',
      },
    },
  });

  const { data: cancelMotionStateQuery } = useGetMotionStateQuery({
    skip: !latestCancelMotion,
    variables: {
      input: {
        colonyAddress,
        databaseMotionId: latestCancelMotion?.databaseMotionId ?? '',
      },
    },
  });

  const networkFundingMotionState =
    fundingMotionStateQuery?.getMotionState ?? MotionState.Null;

  const networkCancelMotionState =
    cancelMotionStateQuery?.getMotionState ?? MotionState.Null;

  const latestFundingMotionState =
    latestFundingMotion &&
    getMotionState(networkFundingMotionState, latestFundingMotion);

  const latestCancelMotionState =
    latestCancelMotion &&
    getMotionState(networkCancelMotionState, latestCancelMotion);

  if (!colony) {
    return null;
  }

  if (loading) {
    return <div>Loading expenditure...</div>;
  }

  if (!data) {
    return null;
  }

  if (!expenditure) {
    return (
      <div>
        This expenditure does not exist in the database but a page refresh might
        help.
      </div>
    );
  }

  const expenditureDomain = findDomainByNativeId(
    expenditure.nativeDomainId,
    colony,
  );

  const fundFromDomain = findDomainByNativeId(
    expenditure.metadata?.fundFromDomainNativeId ?? Id.RootDomain,
    colony,
  );

  const oldFundingMotions = expenditureFundingMotions?.slice(0, -1);
  const oldCancelMotions = expenditureCancelMotions?.slice(0, -1);

  const FundingMotionTag = latestFundingMotionState
    ? motionTags[latestFundingMotionState]
    : () => null;

  const CancelMotionTag = latestCancelMotionState
    ? motionTags[latestCancelMotionState]
    : () => null;

  return (
    <div>
      <Heading3>Expenditure {expenditure.id}</Heading3>

      <div className={styles.details}>
        <div>Status: {expenditure.status}</div>
        <div>Type: {expenditure.type}</div>
        <div>
          Created in: {expenditureDomain?.metadata?.name ?? 'Unknown team'}
        </div>
        <div>Fund from: {fundFromDomain?.metadata?.name ?? 'Unknown team'}</div>
        {oldFundingMotions?.length ? (
          <div>Previous funding motions:</div>
        ) : null}
        {oldFundingMotions?.map(({ transactionHash }, idx) => (
          <Link
            key={transactionHash}
            to={`/${colony.name}?tx=${transactionHash}`}
          >
            Funding motion {idx + 1}
          </Link>
        ))}
        {latestFundingMotionState && (
          <Link to={`/${colony.name}?tx=${latestExpenditureFundingMotionHash}`}>
            Current funding motion status: <FundingMotionTag />
          </Link>
        )}
        {oldCancelMotions?.length ? <div>Previous cancel motions:</div> : null}
        {oldCancelMotions?.map(({ transactionHash }, idx) => (
          <Link
            key={transactionHash}
            to={`/${colony.name}?tx=${transactionHash}`}
          >
            Cancel motion {idx + 1}
          </Link>
        ))}
        {latestCancelMotionState && (
          <Link to={`/${colony.name}?tx=${latestExpenditureCancelMotionHash}`}>
            Current cancel expenditure motion status: <CancelMotionTag />
          </Link>
        )}
        <div>Is Staked: {boolToYesNo(expenditure.isStaked)}</div>
        {expenditure.type === ExpenditureType.Staged && (
          <div>Recipient address: {expenditure.slots[0]?.recipientAddress}</div>
        )}
        <ExpenditureBalances expenditure={expenditure} />
        {expenditure.type === ExpenditureType.PaymentBuilder && (
          <ExpenditurePayouts expenditure={expenditure} colony={colony} />
        )}
        {expenditure.type === ExpenditureType.Staged && (
          <ExpenditureStages expenditure={expenditure} colony={colony} />
        )}
        <div className={styles.buttons}>
          <CancelDraftExpenditureButton
            colony={colony}
            expenditure={expenditure}
          />
          <CancelStakedExpenditureButton
            expenditure={expenditure}
            colony={colony}
            hasMotionFailed={
              latestCancelMotionState &&
              hasMotionFailed(latestCancelMotionState)
            }
            isMotionInProgress={isMotionInProgress(latestCancelMotionState)}
            latestExpenditureCancelMotionHash={
              latestExpenditureCancelMotionHash
            }
          />
          <ExpenditureAdvanceButton
            expenditure={expenditure}
            colony={colony}
            hasMotionFailed={
              latestFundingMotionState &&
              hasMotionFailed(latestFundingMotionState)
            }
            isMotionInProgress={isMotionInProgress(latestFundingMotionState)}
            latestExpenditureFundingMotionHash={
              latestExpenditureFundingMotionHash
            }
          />
          <ReclaimStakeButton colony={colony} expenditure={expenditure} />
        </div>
      </div>
    </div>
  );
};

export default ExpenditureDetailsPage;
