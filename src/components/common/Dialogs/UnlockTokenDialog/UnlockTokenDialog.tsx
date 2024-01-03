import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { string, object, boolean, InferType } from 'yup';

import { MAX_ANNOTATION_LENGTH } from '~constants';
import { WizardDialogType } from '~hooks';
import { ActionTypes } from '~redux/index';
import Dialog, { ActionDialogProps, DialogProps } from '~shared/Dialog';
import { ActionForm } from '~shared/Fields';
import { pipe, withMeta, withKey, mapPayload } from '~utils/actions';

import { getUnlockTokenDialogPayload } from './helpers';
import UnlockTokenForm from './UnlockTokenForm';

type Props = DialogProps &
  Partial<WizardDialogType<object>> &
  ActionDialogProps;

const displayName = 'common.UnlockTokenDialog';

const validationSchema = object()
  .shape({
    forceAction: boolean().defined(),
    annotationMessage: string().max(MAX_ANNOTATION_LENGTH).defined(),
  })
  .defined();

type FormValues = InferType<typeof validationSchema>;

const UnlockTokenDialog = ({
  colony,
  cancel,
  close,
  callStep,
  prevStep,
  enabledExtensionData,
}: Props) => {
  const [isForce, setIsForce] = useState(false);
  const navigate = useNavigate();

  const { isVotingReputationEnabled } = enabledExtensionData;

  const actionType =
    !isForce && isVotingReputationEnabled
      ? ActionTypes.ROOT_MOTION
      : ActionTypes.ACTION_UNLOCK_TOKEN;

  const transform = pipe(
    withKey(colony?.colonyAddress || ''),
    mapPayload((payload) => getUnlockTokenDialogPayload(colony, payload)),
    withMeta({ navigate }),
  );

  return (
    <Dialog cancel={cancel}>
      <ActionForm<FormValues>
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
        actionType={actionType}
        onSuccess={close}
        transform={transform}
      >
        <UnlockTokenForm
          colony={colony}
          back={prevStep && callStep ? () => callStep(prevStep) : undefined}
          enabledExtensionData={enabledExtensionData}
          handleIsForceChange={setIsForce}
          isForce={isForce}
        />
      </ActionForm>
    </Dialog>
  );
};

UnlockTokenDialog.displayName = displayName;

export default UnlockTokenDialog;
