import React, { useState } from 'react';

import { ExpenditureStatus, ExpenditureType } from '~gql';
import Button from '~shared/Button';
import { Colony, Expenditure } from '~types';

import CancelStakedExpenditureDialog from './CancelStakedExpenditureDialog';

interface CancelStakedExpenditureButtonProps {
  colony: Colony;
  expenditure: Expenditure;
}

const CancelStakedExpenditureButton = ({
  colony,
  expenditure,
}: CancelStakedExpenditureButtonProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  if (
    expenditure.metadata?.type !== ExpenditureType.Staked ||
    expenditure.status !== ExpenditureStatus.Locked
  ) {
    return null;
  }

  return (
    <>
      <Button onClick={() => setIsDialogOpen(true)}>
        Cancel expenditure (as non-owner)
      </Button>
      {isDialogOpen && (
        <CancelStakedExpenditureDialog
          colony={colony}
          expenditure={expenditure}
          cancel={() => setIsDialogOpen(false)}
        />
      )}
    </>
  );
};

export default CancelStakedExpenditureButton;
