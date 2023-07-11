import React from 'react';
import { useNavigate } from 'react-router-dom';

import Dialog, { DialogProps, ActionDialogProps } from '~shared/Dialog';
import { ActionHookForm as Form } from '~shared/Fields';

import { ActionTypes } from '~redux/index';
import { WizardDialogType } from '~hooks';
import { pipe, withMeta, mapPayload } from '~utils/actions';

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
  colony: { colonyAddress },
  colony,
}: Props) => {
  const navigate = useNavigate();

  const transform = pipe(
    mapPayload(({ safeList, annotation: annotationMessage }) => {
      return {
        colonyName: colony.name,
        colonyAddress,
        safeList,
        annotationMessage,
        isRemovingSafes: true,
      };
    }),
    withMeta({ navigate }),
  );

  return (
    <Form
      defaultValues={{
        safeList: [],
      }}
      actionType={ActionTypes.ACTION_MANAGE_EXISTING_SAFES}
      onSuccess={close}
      transform={transform}
    >
      <Dialog cancel={cancel}>
        <DialogForm back={() => callStep(prevStep)} safeList={[]} />
      </Dialog>
    </Form>
  );
};

RemoveSafeDialog.displayName = displayName;

export default RemoveSafeDialog;
