import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { Id, MotionState } from '@colony/colony-js';

import { useGetExpenditureQuery, useGetMotionStateQuery } from '~gql';
import { useColonyContext } from '~hooks';
import { Heading3 } from '~shared/Heading';
import { getExpenditureDatabaseId } from '~utils/databaseId';
import { findDomainByNativeId } from '~utils/domains';
import { notNull } from '~utils/arrays';
import { getMotionState } from '~utils/colonyMotions';
import { motionTags } from '~shared/Tag';

import ExpenditureBalances from './ExpenditureBalances';
import ExpenditureAdvanceButton from './ExpenditureAdvanceButton';
import ExpenditurePayouts from './ExpenditurePayouts';
import ReclaimStakeButton from '../StakedExpenditure/ReclaimStakeButton';
import ExpenditureStages from './ExpenditureStages';
import CancelDraftExpenditureButton from './CancelDraftExpenditureButton';

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
    expenditure?.fundingMotions?.items.filter(notNull) ?? [];

  const latestFundingMotion = expenditureFundingMotions.at(-1);

  const latestExpenditureFundingMotionHash: string | undefined =
    latestFundingMotion?.transactionHash;

  const { data: motionStateQuery } = useGetMotionStateQuery({
    skip: !latestFundingMotion,
    variables: {
      input: {
        colonyAddress,
        databaseMotionId: latestFundingMotion?.databaseMotionId ?? '',
      },
    },
  });

  const networkMotionState =
    motionStateQuery?.getMotionState ?? MotionState.Null;

  const latestFundingMotionState =
    latestFundingMotion &&
    getMotionState(networkMotionState, latestFundingMotion);

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

  const MotionTag = latestFundingMotionState
    ? motionTags[latestFundingMotionState]
    : () => null;

  return (
    <div>
      <Heading3>Expenditure {expenditure.id}</Heading3>

      <div className={styles.details}>
        <div>Status: {expenditure.status}</div>
        <div>
          Created in: {expenditureDomain?.metadata?.name ?? 'Unknown team'}
        </div>
        <div>Fund from: {fundFromDomain?.metadata?.name ?? 'Unknown team'}</div>
        <div>Type: {expenditure.metadata?.type}</div>
        {oldFundingMotions?.length ? (
          <div>Previous funding motions:</div>
        ) : null}
        {oldFundingMotions?.map(({ transactionHash }, idx) => (
          <Link
            key={transactionHash}
            to={`/colony/${colony.name}/tx/${transactionHash}`}
          >
            Funding motion {idx + 1}
          </Link>
        ))}
        {latestFundingMotionState && (
          <Link
            to={`/colony/${colony.name}/tx/${latestExpenditureFundingMotionHash}`}
          >
            Current funding motion status: <MotionTag />
          </Link>
        )}
        <div>Is Staged: {expenditure.isStaged ? 'Yes' : 'No'}</div>
        {expenditure.isStaged && (
          <div>Recipient address: {expenditure.slots[0]?.recipientAddress}</div>
        )}
        <ExpenditureBalances expenditure={expenditure} />
        {expenditure.isStaged ? (
          <ExpenditureStages expenditure={expenditure} colony={colony} />
        ) : (
          <ExpenditurePayouts expenditure={expenditure} colony={colony} />
        )}
        <div className={styles.buttons}>
          <CancelDraftExpenditureButton
            colony={colony}
            expenditure={expenditure}
          />
          <ExpenditureAdvanceButton expenditure={expenditure} colony={colony} />
          <ReclaimStakeButton colony={colony} expenditure={expenditure} />
        </div>
      </div>
    </div>
  );
};

export default ExpenditureDetailsPage;
