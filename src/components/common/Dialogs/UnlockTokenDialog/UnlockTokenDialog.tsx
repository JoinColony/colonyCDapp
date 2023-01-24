import React, { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as yup from 'yup';

import Dialog, { ActionDialogProps, DialogProps } from '~shared/Dialog';
import { ActionHookForm as Form } from '~shared/Fields';
import { ActionTypes } from '~redux/index';
import { RootMotionOperationNames } from '~redux/types/actions';
import { pipe, withMeta, withKey, mapPayload } from '~utils/actions';
import { WizardDialogType } from '~hooks'; // useEnabledExtensions

import UnlockTokenForm from './UnlockTokenForm';

export interface FormValues {
  forceAction: boolean;
  annotationMessage: string;
}

type Props = DialogProps &
  Partial<WizardDialogType<object>> &
  ActionDialogProps;

const displayName = 'common.ColonyHome.UnlockTokenDialog';

const validationSchema = yup
  .object()
  .shape({
    forceAction: yup.bool().defined(),
    annotationMessage: yup.string().max(4000).defined(),
  })
  .defined();

const UnlockTokenDialog = ({
  colony: { colonyAddress, name: colonyName },
  colony,
  cancel,
  close,
  callStep,
  prevStep,
}: Props) => {
  const [isForce, setIsForce] = useState(false);
  const navigate = useNavigate();

  // const { isVotingExtensionEnabled } = useEnabledExtensions({
  //   colonyAddress: colony.colonyAddress,
  // });

  const getFormAction = useCallback(
    (actionType: 'SUBMIT' | 'ERROR' | 'SUCCESS') => {
      const actionEnd = actionType === 'SUBMIT' ? '' : `_${actionType}`;

      return !isForce // && isVotingExtensionEnabled
        ? ActionTypes[`ROOT_MOTION${actionEnd}`]
        : ActionTypes[`ACTION_UNLOCK_TOKEN${actionEnd}`];
    },
    [isForce], // , isVotingExtensionEnabled
  );

  const transform = useCallback(
    () =>
      pipe(
        withKey(colonyAddress),
        mapPayload(({ annotationMessage }) => ({
          annotationMessage,
          colonyAddress,
          operationName: RootMotionOperationNames.UNLOCK_TOKEN,
          motionParams: [],
          colonyName,
        })),
        withMeta({ navigate }),
      ),
    [colonyAddress, navigate, colonyName],
  );

  return (
    <Form<FormValues>
      defaultValues={{
        forceAction: false,
        annotationMessage: '',
        /*
         * @NOTE That since this a root motion, and we don't actually make use
         * of the motion domain selected (it's disabled), we don't need to actually
         * pass the value over to the motion, since it will always be 1
         */
      }}
      validationSchema={validationSchema}
      submit={getFormAction('SUBMIT')}
      error={getFormAction('ERROR')}
      success={getFormAction('SUCCESS')}
      onSuccess={close}
      transform={transform}
    >
      {({ formState, getValues }) => {
        const values = getValues();
        if (values.forceAction !== isForce) {
          setIsForce(values.forceAction);
        }

        return (
          <Dialog cancel={cancel}>
            <UnlockTokenForm
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

UnlockTokenDialog.displayName = displayName;

export default UnlockTokenDialog;
