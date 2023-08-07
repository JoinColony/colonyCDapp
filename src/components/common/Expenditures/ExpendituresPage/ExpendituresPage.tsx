import React from 'react';

import { Heading3 } from '~shared/Heading';
import { useGetColonyExpendituresQuery } from '~gql';
import { useColonyContext } from '~hooks';
import { notNull } from '~utils/arrays';
import Link from '~shared/Link';

import ExpenditureForm from '../ExpenditureForm';

import styles from './ExpendituresPage.module.css';

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
                to={`/colony/${colony.name}/expenditures/${expenditure.nativeId}`}
              >
                Expenditure ID: {expenditure.nativeId}
              </Link>
            </li>
          ))}
      </ul>

      <div>
        <Heading3>Create new expenditure</Heading3>
        <ExpenditureForm />
      </div>
    </div>
  );
};

export default ExpendituresPage;
