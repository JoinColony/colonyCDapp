import React from 'react';

import { ExpenditureStatus } from '~gql';
import { Colony, Expenditure } from '~types';
import { ActionTypes } from '~redux';

import EditExpenditureForm from './EditExpenditureForm';

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
  let actionType: ActionTypes | null = null;

  if (expenditure.status === ExpenditureStatus.Draft) {
    actionType = ActionTypes.EXPENDITURE_EDIT;
  } else if (expenditure.status === ExpenditureStatus.Locked) {
    actionType = ActionTypes.EXPENDITURE_LOCKED_EDIT;
  }

  if (!actionType) {
    return null;
  }

  return (
    <EditExpenditureForm
      colony={colony}
      expenditure={expenditure}
      onEditingFinished={onEditingFinished}
      actionType={actionType}
    />
  );
};

export default EditExpenditure;
