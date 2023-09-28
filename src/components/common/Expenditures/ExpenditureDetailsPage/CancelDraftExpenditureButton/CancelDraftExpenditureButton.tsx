import { Extension } from '@colony/colony-js';
import React from 'react';

import { ExpenditureStatus } from '~gql';
import { useExtensionData } from '~hooks';
import { ActionTypes } from '~redux';
import { ActionButton } from '~shared/Button';
import { Colony, Expenditure } from '~types';
import { isInstalledExtensionData } from '~utils/extensions';

interface CancelDraftExpenditureButtonProps {
  colony: Colony;
  expenditure: Expenditure;
}

const CancelDraftExpenditureButton = ({
  colony,
  expenditure,
}: CancelDraftExpenditureButtonProps) => {
  const { extensionData } = useExtensionData(Extension.StakedExpenditure);

  if (expenditure.status !== ExpenditureStatus.Draft) {
    return null;
  }

  return (
    <ActionButton
      actionType={ActionTypes.EXPENDITURE_DRAFT_CANCEL}
      values={{
        colonyAddress: colony.colonyAddress,
        expenditure,
        stakedExpenditureAddress:
          extensionData && isInstalledExtensionData(extensionData)
            ? extensionData.address
            : undefined,
      }}
    >
      Cancel expenditure
    </ActionButton>
  );
};

export default CancelDraftExpenditureButton;
