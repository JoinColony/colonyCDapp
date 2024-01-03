import { Extension, Id } from '@colony/colony-js';
import React from 'react';
import { useNavigate } from 'react-router-dom';

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
import { mapPayload, pipe, withMeta } from '~utils/actions';
import { isInstalledExtensionData } from '~utils/extensions';

interface FormValues {
  shouldPenalise: boolean;
}

interface CancelStakedExpenditureDialogProps
  extends Pick<DialogProps, 'cancel'> {
  colony: Colony;
  expenditure: Expenditure;
  isMotion: boolean;
}

const CancelStakedExpenditureDialog = ({
  colony,
  expenditure,
  isMotion,
  cancel,
}: CancelStakedExpenditureDialogProps) => {
  const { extensionData } = useExtensionData(Extension.StakedExpenditure);
  const navigate = useNavigate();

  const transform = pipe(
    mapPayload((payload: FormValues) => ({
      ...payload,
      ...(isMotion
        ? {
            fromDomainId:
              expenditure.metadata?.fundFromDomainNativeId ?? Id.RootDomain,
            motionDomainId: expenditure.nativeDomainId ?? Id.RootDomain,
          }
        : {}),
      colonyName: colony.name,
      colonyAddress: colony.colonyAddress,
      stakedExpenditureAddress:
        extensionData && isInstalledExtensionData(extensionData)
          ? extensionData.address
          : '',
      expenditure,
    })),
    withMeta({ navigate }),
  );

  return (
    <Dialog cancel={cancel}>
      <ActionForm
        actionType={
          isMotion
            ? ActionTypes.MOTION_STAKED_EXPENDITURE_CANCEL
            : ActionTypes.STAKED_EXPENDITURE_CANCEL
        }
        transform={transform}
        defaultValues={{
          shouldPunish: false,
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
