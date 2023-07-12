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

const hardcodedSafes = [
  {
    name: 'test',
    safeName: 'test',
    chainId: 56,
    contractAddress: '0xe759f388c97674D5B8a60406b254aB59f194163d',
  },
  {
    name: 'test2',
    safeName: 'test2',
    chainId: 1,
    contractAddress: '0x3F107AFF0342Cfb5519A68B3241565F6FC9BAC1e',
  },
  {
    name: 'test3',
    safeName: 'test3',
    contractAddress: '0x3F107AFF0342Cfb5519A68B3241565F6FC9BAC1e',
    chainId: 5,
  },
];

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
        <DialogForm back={() => callStep(prevStep)} safeList={hardcodedSafes} />
      </Dialog>
    </Form>
  );
};

RemoveSafeDialog.displayName = displayName;

export default RemoveSafeDialog;
