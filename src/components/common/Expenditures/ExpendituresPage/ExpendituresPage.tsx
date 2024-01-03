import React from 'react';

import { useGetColonyExpendituresQuery } from '~gql';
import { useColonyContext } from '~hooks';
import { COLONY_EXPENDITURES_ROUTE } from '~routes';
import { Heading3 } from '~shared/Heading';
import Link from '~shared/Link';
import { notNull } from '~utils/arrays';

import CreateExpenditure from '../ExpenditureForm/CreateExpenditure';

import styles from './ExpendituresPage.module.css';

// import { CreateExpenditureForm } from '../ExpenditureForm';

const ExpendituresPage = () => {
  const { colony } = useColonyContext();

  const { data, loading } = useGetColonyExpendituresQuery({
    variables: {
      colonyAddress: colony?.colonyAddress ?? '',
    },
    skip: !colony,
  });

  if (!colony) {
    return null;
  }

  return (
    <div className={styles.pageWrapper}>
      <ul>
        {loading && <div>Loading expenditures...</div>}
        {data?.getColony?.expenditures?.items
          .filter(notNull)
          .map((expenditure) => (
            <li key={expenditure.id}>
              <Link
                to={`/${colony.name}/${COLONY_EXPENDITURES_ROUTE}/${expenditure.nativeId}`}
              >
                Expenditure ID: {expenditure.nativeId}
              </Link>
            </li>
          ))}
      </ul>

      <div>
        <Heading3>Create new expenditure</Heading3>
        <CreateExpenditure />
      </div>
    </div>
  );
};

export default ExpendituresPage;
