import React, { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { string, object, boolean, InferType } from 'yup';

import Dialog, { ActionDialogProps, DialogProps } from '~shared/Dialog';
import { ActionHookForm as Form } from '~shared/Fields';
import { ActionTypes } from '~redux/index';
import { RootMotionMethodNames } from '~redux/types/actions';
import { pipe, withMeta, withKey, mapPayload } from '~utils/actions';
import { WizardDialogType } from '~hooks'; // useEnabledExtensions

import UnlockTokenForm from './UnlockTokenForm';

type Props = DialogProps &
  Partial<WizardDialogType<object>> &
  ActionDialogProps;

const displayName = 'common.UnlockTokenDialog';

const validationSchema = object()
  .shape({
    forceAction: boolean().defined(),
    annotationMessage: string().max(4000).defined(),
  })
  .defined();

type FormValues = InferType<typeof validationSchema>;

const UnlockTokenDialog = ({
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

  const getFormAction = (actionType: 'SUBMIT' | 'ERROR' | 'SUCCESS') => {
    const actionEnd = actionType === 'SUBMIT' ? '' : `_${actionType}`;

    return !isForce // && isVotingExtensionEnabled
      ? ActionTypes[`ROOT_MOTION${actionEnd}`]
      : ActionTypes[`ACTION_UNLOCK_TOKEN${actionEnd}`];
  };

  const transform = useCallback(
    () =>
      pipe(
        withKey(colony?.colonyAddress || ''),
        mapPayload(({ annotationMessage }) => ({
          annotationMessage,
          colonyAddress: colony?.colonyAddress,
          operationName: RootMotionMethodNames.UnlockToken,
          motionParams: [],
          colonyName: colony?.name,
        })),
        withMeta({ navigate }),
      ),
    [colony, navigate],
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
      {({ getValues }) => {
        const forceActionValue = getValues('forceAction');
        if (forceActionValue !== isForce) {
          setIsForce(forceActionValue);
        }
        return (
          <Dialog cancel={cancel}>
            <UnlockTokenForm
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
