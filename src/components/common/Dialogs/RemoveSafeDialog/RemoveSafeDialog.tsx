import React from 'react';
import { useNavigate } from 'react-router-dom';

import Dialog, { DialogProps, ActionDialogProps } from '~shared/Dialog';
import { ActionForm } from '~shared/Fields';

import { ActionTypes } from '~redux';
import { WizardDialogType } from '~hooks';
import { pipe, withMeta, mapPayload } from '~utils/actions';

import { getRemoveSafeDialogPayload } from './helpers';

import DialogForm from './RemoveSafeDialogForm';

const displayName = 'common.RemoveSafeDialog';

type Props = Required<DialogProps> &
  WizardDialogType<object> &
  ActionDialogProps;

const RemoveSafeDialog = ({
  cancel,
  close,
  callStep,
  prevStep,
  colony,
}: Props) => {
  const navigate = useNavigate();

  const transform = pipe(
    mapPayload((payload) => getRemoveSafeDialogPayload(colony, payload)),
    withMeta({ navigate }),
  );

  return (
    <Dialog cancel={cancel}>
      <ActionForm
        defaultValues={{
          safes: [],
        }}
        actionType={ActionTypes.ACTION_MANAGE_EXISTING_SAFES}
        onSuccess={close}
        transform={transform}
      >
        <DialogForm
          back={() => callStep(prevStep)}
          colonySafes={colony.metadata?.safes || []}
        />
      </ActionForm>
    </Dialog>
  );
};

RemoveSafeDialog.displayName = displayName;

export default RemoveSafeDialog;
