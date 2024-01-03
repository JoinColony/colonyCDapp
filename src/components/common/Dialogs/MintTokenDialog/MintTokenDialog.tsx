import React, { useState } from 'react';
import { defineMessages } from 'react-intl';
import { useNavigate } from 'react-router-dom';
import { string, object, bool, InferType, number } from 'yup';

import { MAX_ANNOTATION_LENGTH } from '~constants';
import { WizardDialogType } from '~hooks';
import { ActionTypes } from '~redux';
import Dialog, { DialogProps, ActionDialogProps } from '~shared/Dialog';
import { ActionForm } from '~shared/Fields';
import { pipe, mapPayload, withMeta } from '~utils/actions';
import { toFinite } from '~utils/lodash';

import { getMintTokenDialogPayload } from './helpers';
import MintTokenDialogForm from './MintTokenDialogForm';

const displayName = 'common.MintTokenDialog';

const MSG = defineMessages({
  errorAmountMin: {
    id: `${displayName}.errorAmountMin`,
    defaultMessage: 'Please enter an amount greater than 0.',
  },
  errorAmountRequired: {
    id: `${displayName}.errorAmountRequired`,
    defaultMessage: 'Please enter an amount.',
  },
});

type Props = DialogProps &
  Partial<WizardDialogType<object>> &
  ActionDialogProps;

const validationSchema = object()
  .shape({
    forceAction: bool().defined(),
    annotation: string().max(MAX_ANNOTATION_LENGTH).defined(),
    mintAmount: number()
      .required(() => MSG.errorAmountRequired)
      .transform((value) => toFinite(value))
      .moreThan(0, () => MSG.errorAmountMin),
  })
  .defined();

type FormValues = InferType<typeof validationSchema>;

const MintTokenDialog = ({
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
      : ActionTypes.ACTION_MINT_TOKENS;

  const transform = pipe(
    mapPayload((payload) => getMintTokenDialogPayload(colony, payload)),
    withMeta({ navigate }),
  );

  return (
    <Dialog cancel={cancel}>
      <ActionForm<FormValues>
        defaultValues={{
          forceAction: false,
          annotation: '',
          mintAmount: 0,
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
        <MintTokenDialogForm
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

MintTokenDialog.displayName = displayName;

export default MintTokenDialog;
