import React from 'react';
import { useParams } from 'react-router-dom';
import { Id } from '@colony/colony-js';

import { ExpenditureStatus, useGetExpenditureQuery } from '~gql';
import { useColonyContext } from '~hooks';
import { Heading3 } from '~shared/Heading';
import { getExpenditureDatabaseId } from '~utils/databaseId';
import { findDomainByNativeId } from '~utils/domains';
import { ActionButton } from '~shared/Button';
import { ActionTypes } from '~redux';

import ExpenditureBalances from './ExpenditureBalances';
import ExpenditureAdvanceButton from './ExpenditureAdvanceButton';
import ExpenditurePayouts from './ExpenditurePayouts';

import styles from './ExpenditureDetailsPage.module.css';

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

  return (
    <div>
      <Heading3>Expenditure {expenditure.id}</Heading3>

      <div className={styles.details}>
        <div>Status: {expenditure.status}</div>
        <div>
          Created in: {expenditureDomain?.metadata?.name ?? 'Unknown team'}
        </div>
        <div>Fund from: {fundFromDomain?.metadata?.name ?? 'Unknown team'}</div>
        <ExpenditureBalances expenditure={expenditure} />
        <ExpenditurePayouts expenditure={expenditure} colony={colony} />
        <div className={styles.buttons}>
          {expenditure.status === ExpenditureStatus.Draft && (
            <ActionButton
              actionType={ActionTypes.EXPENDITURE_CANCEL}
              appearance={{ size: 'small' }}
              values={{
                colonyAddress: colony.colonyAddress,
                nativeExpenditureId: expenditure.nativeId,
              }}
            >
              Cancel expenditure
            </ActionButton>
          )}
          <ExpenditureAdvanceButton expenditure={expenditure} colony={colony} />
        </div>
      </div>
    </div>
  );
};

export default ExpenditureDetailsPage;
