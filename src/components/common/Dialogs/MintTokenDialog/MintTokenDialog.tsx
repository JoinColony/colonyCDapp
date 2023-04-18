import React, { useState } from 'react';
import { defineMessages } from 'react-intl';
import { string, object, bool, InferType, number } from 'yup';
import { useNavigate } from 'react-router-dom';

import Dialog, { DialogProps, ActionDialogProps } from '~shared/Dialog';
import { ActionHookForm as Form } from '~shared/Fields';
import { ActionTypes } from '~redux';
import { pipe, mapPayload, withMeta } from '~utils/actions';
import { WizardDialogType } from '~hooks';
import { toFinite } from '~utils/lodash';

import MintTokenDialogForm from './MintTokenDialogForm';
import { getMintTokenDialogPayload } from './helpers';

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

type Props = DialogProps & Partial<WizardDialogType<object>> & ActionDialogProps;

const validationSchema = object()
  .shape({
    forceAction: bool().defined(),
    annotation: string().max(4000).defined(),
    mintAmount: number()
      .required(() => MSG.errorAmountRequired)
      .transform((value) => toFinite(value))
      .moreThan(0, () => MSG.errorAmountMin),
  })
  .defined();

type FormValues = InferType<typeof validationSchema>;

const MintTokenDialog = ({ colony, cancel, close, callStep, prevStep, enabledExtensionData }: Props) => {
  const [isForce, setIsForce] = useState(false);
  const navigate = useNavigate();

  const { isVotingReputationEnabled } = enabledExtensionData;

  const actionType = !isForce && isVotingReputationEnabled ? ActionTypes.ROOT_MOTION : ActionTypes.ACTION_MINT_TOKENS;

  const transform = pipe(
    mapPayload((payload) => getMintTokenDialogPayload(colony, payload)),
    withMeta({ navigate }),
  );

  return (
    <Dialog cancel={cancel}>
      <Form<FormValues>
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
        {({ watch }) => {
          const forceActionValue = watch('forceAction');
          if (forceActionValue !== isForce) {
            setIsForce(forceActionValue);
          }
          return (
            <MintTokenDialogForm
              colony={colony}
              back={prevStep && callStep ? () => callStep(prevStep) : undefined}
              enabledExtensionData={enabledExtensionData}
            />
          );
        }}
      </Form>
    </Dialog>
  );
};

MintTokenDialog.displayName = displayName;

export default MintTokenDialog;
