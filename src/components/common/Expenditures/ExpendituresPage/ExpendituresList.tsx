import React from 'react';

import { useGetColonyExpendituresQuery } from '~gql';
import { Heading4 } from '~shared/Heading';
import Link from '~shared/Link';
import { Colony } from '~types';
import { notNull } from '~utils/arrays';

import styles from './ExpendituresPage.module.css';

interface ExpendituresListProps {
  colony: Colony;
}

const ExpendituresList = ({ colony }: ExpendituresListProps) => {
  const { data, loading } = useGetColonyExpendituresQuery({
    variables: {
      colonyAddress: colony?.colonyAddress ?? '',
    },
    skip: !colony,
  });

  return (
    <div className={styles.listWrapper}>
      {loading && <div>Loading expenditures...</div>}
      <Heading4 appearance={{ margin: 'none' }}>Expenditures</Heading4>
      <ul>
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

      <Heading4 appearance={{ margin: 'none' }}>Streaming Payments</Heading4>
      <ul>
        {data?.getColony?.streamingPayments?.items
          .filter(notNull)
          .map((streamingPayment) => (
            <li key={streamingPayment.id}>
              <Link
                to={`/colony/${colony.name}/expenditures/${streamingPayment.nativeId}`}
              >
                Streaming Payment ID: {streamingPayment.nativeId}
              </Link>
            </li>
          ))}
      </ul>
    </div>
  );
};

export default ExpendituresList;
