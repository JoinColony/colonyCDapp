import { Extension } from '@colony/colony-js';
import React from 'react';
import { DEFAULT_TOKEN_DECIMALS } from '~constants';

import { useExtensionData } from '~hooks';
import { ActionTypes } from '~redux';
import Button from '~shared/Button';
import { DialogProps, DialogSection } from '~shared/Dialog';
import Dialog from '~shared/Dialog/Dialog';
import { ActionForm, Toggle } from '~shared/Fields';
import { Heading3 } from '~shared/Heading';
import Numeral from '~shared/Numeral/Numeral';
import { Colony, Expenditure } from '~types';
import { mapPayload, pipe } from '~utils/actions';
import { isInstalledExtensionData } from '~utils/extensions';

interface FormValues {
  shouldPenalise: boolean;
}

interface CancelStakedExpenditureDialogProps
  extends Pick<DialogProps, 'cancel'> {
  colony: Colony;
  expenditure: Expenditure;
}

const CancelStakedExpenditureDialog = ({
  colony,
  expenditure,
  cancel,
}: CancelStakedExpenditureDialogProps) => {
  const { extensionData } = useExtensionData(Extension.StakedExpenditure);

  const transform = pipe(
    mapPayload((payload: FormValues) => ({
      ...payload,
      colonyAddress: colony.colonyAddress,
      stakedExpenditureAddress:
        extensionData && isInstalledExtensionData(extensionData)
          ? extensionData.address
          : '',
      expenditure,
    })),
  );

  return (
    <Dialog cancel={cancel}>
      <ActionForm
        actionType={ActionTypes.STAKED_EXPENDITURE_CANCEL}
        transform={transform}
        defaultValues={{
          shouldPenalise: false,
        }}
      >
        <DialogSection>
          <Heading3 appearance={{ margin: 'none' }}>
            Cancel the expenditure
          </Heading3>
        </DialogSection>
        <DialogSection>
          Creator&apos;s stake:{' '}
          <Numeral
            value={expenditure.metadata?.stakeAmount ?? '0'}
            decimals={DEFAULT_TOKEN_DECIMALS}
            suffix={colony.nativeToken.symbol}
          />
        </DialogSection>
        <DialogSection>
          <Toggle name="shouldPunish" label="Punish" />
        </DialogSection>
        <DialogSection>
          <Button type="submit">Confirm cancellation</Button>
        </DialogSection>
      </ActionForm>
    </Dialog>
  );
};

export default CancelStakedExpenditureDialog;
