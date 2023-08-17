import React from 'react';
import { useParams } from 'react-router-dom';
import { Id } from '@colony/colony-js';

import { useGetExpenditureQuery } from '~gql';
import { useColonyContext } from '~hooks';
import NotFoundRoute from '~routes/NotFoundRoute';
import { Heading3 } from '~shared/Heading';
import { getExpenditureDatabaseId } from '~utils/databaseId';
import { findDomainByNativeId } from '~utils/domains';

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
    return <NotFoundRoute />;
  }

  const expenditureDomain = findDomainByNativeId(
    expenditure.metadata?.nativeDomainId ?? Id.RootDomain,
    colony,
  );

  return (
    <div>
      <Heading3>Expenditure {expenditure.id}</Heading3>

      <div className={styles.details}>
        <div>Status: {expenditure.status}</div>
        <div>Team: {expenditureDomain?.metadata?.name ?? 'Unknown team'}</div>
        <ExpenditureBalances expenditure={expenditure} />
        <ExpenditurePayouts expenditure={expenditure} colony={colony} />
        <ExpenditureAdvanceButton expenditure={expenditure} colony={colony} />
      </div>
    </div>
  );
};

export default ExpenditureDetailsPage;
