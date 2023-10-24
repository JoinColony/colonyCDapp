import React from 'react';

import { Heading3 } from '~shared/Heading';
import { useColonyContext } from '~hooks';

import CreateExpenditure from '../ExpenditureForm/CreateExpenditure';
import ExpendituresList from './ExpendituresList';

import styles from './ExpendituresPage.module.css';

const ExpendituresPage = () => {
  const { colony } = useColonyContext();

  if (!colony) {
    return null;
  }

  return (
    <div className={styles.pageWrapper}>
      <ExpendituresList colony={colony} />

      <div>
        <Heading3>Create new expenditure</Heading3>
        <CreateExpenditure />
      </div>
    </div>
  );
};

export default ExpendituresPage;
