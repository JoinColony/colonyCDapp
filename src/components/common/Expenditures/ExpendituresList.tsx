import React from 'react';

import ExpenditureForm from './ExpenditureForm';
import { Heading3 } from '~shared/Heading';

const ExpendituresList = () => {
  return (
    <div>
      Expenditures list
      <div>
        <Heading3>Create new expenditure</Heading3>
        <ExpenditureForm />
      </div>
    </div>
  );
};

export default ExpendituresList;
