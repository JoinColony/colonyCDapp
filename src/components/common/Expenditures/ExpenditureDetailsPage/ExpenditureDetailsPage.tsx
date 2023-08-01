import React from 'react';
import { useParams } from 'react-router-dom';

import { ExpenditureStatus, useGetExpenditureQuery } from '~gql';
import { useColonyContext } from '~hooks';
import { ActionTypes } from '~redux';
import NotFoundRoute from '~routes/NotFoundRoute';
import { ActionButton } from '~shared/Button';
import { Heading3 } from '~shared/Heading';
import { getExpenditureDatabaseId } from '~utils/databaseId';
import MaskedAddress from '~shared/MaskedAddress';

import styles from './ExpenditureDetailsPage.module.css';

const ExpenditureDetailsPage = () => {
  const { expenditureId } = useParams();

  const { colony } = useColonyContext();

  const { data } = useGetExpenditureQuery({
    variables: {
      expenditureId: getExpenditureDatabaseId(
        colony?.colonyAddress ?? '',
        Number(expenditureId),
      ),
    },
    skip: !expenditureId,
  });

  if (!colony || !data) {
    return null;
  }

  const expenditure = data.getExpenditure;
  if (!expenditure) {
    return <NotFoundRoute />;
  }

  return (
    <div>
      <Heading3>Expenditure {expenditure.id}</Heading3>
      <div>Status: {expenditure.status}</div>

      <ul className={styles.recipients}>
        {expenditure.slots.map((slot) => (
          <li key={slot.id} className={styles.recipient}>
            <div>
              <div>Recipient address</div>
              <MaskedAddress address={slot.recipientAddress ?? ''} />
            </div>

            <div>
              <div>Token address</div>
              {slot.payouts?.map((payout) => (
                <MaskedAddress
                  key={payout.tokenAddress}
                  address={payout.tokenAddress}
                />
              ))}
            </div>

            <div>
              <div>Amount</div>
              {slot.payouts?.map((payout) => (
                <div key={payout.tokenAddress}>{payout.amount}</div>
              ))}
            </div>

            <div>
              <div>Claim delay</div>
              <div>
                {slot.claimDelay ? `${slot.claimDelay} seconds` : 'None'}
              </div>
            </div>
          </li>
        ))}
      </ul>

      {expenditure.status === ExpenditureStatus.Draft && (
        <ActionButton
          actionType={ActionTypes.EXPENDITURE_LOCK}
          values={{
            colonyAddress: colony.colonyAddress,
            nativeExpenditureId: expenditure.nativeId,
          }}
        >
          Lock expenditure
        </ActionButton>
      )}

      {expenditure.status === ExpenditureStatus.Locked && (
        <ActionButton
          actionType={ActionTypes.EXPENDITURE_FINALIZE}
          values={{
            colonyAddress: colony.colonyAddress,
            nativeExpenditureId: expenditure.nativeId,
          }}
        >
          Finalize expenditure
        </ActionButton>
      )}
    </div>
  );
};

export default ExpenditureDetailsPage;
