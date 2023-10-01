import React from 'react';

import { ExpenditureStatus } from '~gql';
import { Expenditure } from '~types';

import EditExpenditureForm from './EditExpenditureForm';

interface EditExpenditureProps {
  expenditure: Expenditure;
  onEditingFinished: () => void;
}

const EditExpenditure = ({
  expenditure,
  onEditingFinished,
}: EditExpenditureProps) => {
  if (expenditure.status === ExpenditureStatus.Draft) {
    return (
      <EditExpenditureForm
        expenditure={expenditure}
        onEditingFinished={onEditingFinished}
      />
    );
  }

  if (expenditure.status === ExpenditureStatus.Locked) {
    return <div>Edit Locked Expenditure</div>;
  }

  return null;
};

export default EditExpenditure;
