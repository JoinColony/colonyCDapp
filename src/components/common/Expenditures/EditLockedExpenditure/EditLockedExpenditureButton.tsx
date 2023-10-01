import React from 'react';

import { ExpenditureStatus } from '~gql';
import Button from '~shared/Button';
import { Expenditure } from '~types';

interface EditLockedExpenditureButtonProps {
  expenditure: Expenditure;
}

const EditLockedExpenditureButton = ({
  expenditure,
}: EditLockedExpenditureButtonProps) => {
  if (expenditure.status !== ExpenditureStatus.Locked) {
    return null;
  }

  return <Button>Edit expenditure</Button>;
};

export default EditLockedExpenditureButton;
