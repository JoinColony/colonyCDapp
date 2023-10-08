import React from 'react';

import { ExpenditureStatus } from '~gql';
import { Colony, Expenditure } from '~types';

import EditExpenditureForm from './EditExpenditureForm';
import EditLockedExpenditureForm from './EditLockedExpenditureForm';

interface EditExpenditureProps {
  expenditure: Expenditure;
  onEditingFinished: () => void;
  colony: Colony;
}

const EditExpenditure = ({
  expenditure,
  onEditingFinished,
  colony,
}: EditExpenditureProps) => {
  if (expenditure.status === ExpenditureStatus.Draft) {
    return (
      <EditExpenditureForm
        colony={colony}
        expenditure={expenditure}
        onEditingFinished={onEditingFinished}
      />
    );
  }

  if (expenditure.status === ExpenditureStatus.Locked) {
    return (
      <EditLockedExpenditureForm
        colony={colony}
        expenditure={expenditure}
        onEditingFinished={onEditingFinished}
      />
    );
  }

  return null;
};

export default EditExpenditure;
