import React from 'react';
import { useParams } from 'react-router-dom';
import { Id } from '@colony/colony-js';

import { useGetExpenditureQuery } from '~gql';
import { useColonyContext } from '~hooks';
import NotFoundRoute from '~routes/NotFoundRoute';
import { Heading3 } from '~shared/Heading';
import { getExpenditureDatabaseId } from '~utils/databaseId';
import MaskedAddress from '~shared/MaskedAddress';

import Numeral from '~shared/Numeral';
import { findDomainByNativeId } from '~utils/domains';

import styles from './ExpenditureDetailsPage.module.css';
import ExpenditureBalances from './ExpenditureBalances/ExpenditureBalances';
import ExpenditureAdvanceButton from './ExpenditureAdvanceButton';

const ExpenditureDetailsPage = () => {
  const { expenditureId } = useParams();

  const { colony } = useColonyContext();

  const { data, loading } = useGetExpenditureQuery({
    variables: {
      expenditureId: getExpenditureDatabaseId(
        colony?.colonyAddress ?? '',
        Number(expenditureId),
      ),
    },
    skip: !expenditureId,
  });

  if (!colony) {
    return null;
  }

  if (loading) {
    return <div>Loading expenditure...</div>;
  }

  if (!data) {
    return null;
  }

  const expenditure = data.getExpenditure;
  if (!expenditure) {
    return <NotFoundRoute />;
  }

  const expenditureDomain = findDomainByNativeId(
    expenditure.metadata?.nativeDomainId ?? Id.RootDomain,
    colony,
  );

  return (
    <div>
      <Heading3>Expenditure {expenditure.id}</Heading3>
      <div>Status: {expenditure.status}</div>
      <div>Team: {expenditureDomain?.metadata?.name ?? 'Unknown team'}</div>
      <ExpenditureBalances expenditure={expenditure} />

      <ul className={styles.recipients}>
        {expenditure.slots.map((slot) => (
          <li key={slot.id} className={styles.recipient}>
            <div>
              <div>Slot ID</div>
              <div>{slot.id}</div>
            </div>

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
                <div key={payout.tokenAddress}>
                  <Numeral
                    value={payout.amount}
                    decimals={colony.nativeToken.decimals}
                    suffix={colony.nativeToken.symbol}
                  />
                </div>
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

      <ExpenditureAdvanceButton expenditure={expenditure} colony={colony} />
    </div>
  );
};

export default ExpenditureDetailsPage;
