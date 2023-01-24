import React, { useCallback, useState } from 'react';
import { string, object, boolean } from 'yup';
import { useNavigate } from 'react-router-dom';

import { pipe, mergePayload, withMeta, mapPayload } from '~utils/actions';
import Dialog, { DialogProps, ActionDialogProps } from '~shared/Dialog';
import { ActionHookForm as Form } from '~shared/Fields';

import { ActionTypes } from '~redux/index';
import { RootMotionOperationNames } from '~redux/types/actions';
import { WizardDialogType } from '~hooks'; // useEnabledExtensions

import DialogForm from './NetworkContractUpgradeDialogForm';

export interface FormValues {
  forceAction: boolean;
  annotation: string;
}

type Props = DialogProps &
  Partial<WizardDialogType<object>> &
  ActionDialogProps;

const displayName = 'common.NetworkContractUpgradeDialog';

const validationSchema = object()
  .shape({
    forceAction: boolean().defined(),
    annotation: string().max(4000).defined(),
  })
  .defined();

const NetworkContractUpgradeDialog = ({
  cancel,
  close,
  callStep,
  prevStep,
  colony,
  colony: { colonyAddress, name }, // version
}: Props) => {
  const [isForce, setIsForce] = useState(false);
  const navigate = useNavigate();

  // const { isVotingExtensionEnabled } = useEnabledExtensions({
  //   colonyAddress: colony.colonyAddress,
  // });

  const getFormAction = useCallback(
    (actionType: 'SUBMIT' | 'ERROR' | 'SUCCESS') => {
      const actionEnd = actionType === 'SUBMIT' ? '' : `_${actionType}`;

      return !isForce // isVotingExtensionEnabled &&
        ? ActionTypes[`ROOT_MOTION${actionEnd}`]
        : ActionTypes[`ACTION_VERSION_UPGRADE${actionEnd}`];
    },
    [isForce], // isVotingExtensionEnabled,
  );
  const currentVersion = parseInt('1', 10); // version
  const nextVersion = currentVersion + 1;
  const transform = useCallback(
    () =>
      pipe(
        mapPayload(({ annotation: annotationMessage }) => {
          return {
            operationName: RootMotionOperationNames.UPGRADE,
            colonyAddress,
            colonyName: name,
            version: '1', // version
            motionParams: [nextVersion],
            annotationMessage,
          };
        }),
        mergePayload({ colonyAddress, version: '1', colonyName: name }), // version
        withMeta({ navigate }),
      ),
    [colonyAddress, name, navigate, nextVersion], // version
  );

  return (
    <Form<FormValues>
      defaultValues={{
        forceAction: false,
        annotation: '',
        /*
         * @NOTE That since this a root motion, and we don't actually make use
         * of the motion domain selected (it's disabled), we don't need to actually
         * pass the value over to the motion, since it will always be 1
         */
      }}
      submit={getFormAction('SUBMIT')}
      error={getFormAction('ERROR')}
      success={getFormAction('SUCCESS')}
      validationSchema={validationSchema}
      transform={transform}
      onSuccess={close}
    >
      {({ formState, getValues }) => {
        const values = getValues();
        if (values.forceAction !== isForce) {
          setIsForce(values.forceAction);
        }
        return (
          <Dialog cancel={cancel}>
            <DialogForm
              {...formState}
              values={values}
              colony={colony}
              back={prevStep && callStep ? () => callStep(prevStep) : undefined}
            />
          </Dialog>
        );
      }}
    </Form>
  );
};

NetworkContractUpgradeDialog.displayName = displayName;

export default NetworkContractUpgradeDialog;
