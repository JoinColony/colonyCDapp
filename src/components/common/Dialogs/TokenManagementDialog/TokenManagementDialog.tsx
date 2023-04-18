import React, { useState } from 'react';
import { defineMessages } from 'react-intl';
import { useNavigate } from 'react-router-dom';
import { string, object, array, boolean, InferType } from 'yup';

import Dialog, { DialogProps, ActionDialogProps } from '~shared/Dialog';

import { ActionHookForm as Form } from '~shared/Fields';

import { ActionTypes } from '~redux/index';
import { pipe, mapPayload, withMeta } from '~utils/actions';
import { WizardDialogType } from '~hooks';
import { formatText } from '~utils/intl';

import { getTokenManagementDialogPayload } from './helpers';
import TokenManagementDialogForm from './TokenManagementDialogForm';

const displayName = 'common.TokenManagementDialog';

const MSG = defineMessages({
  errorAddingToken: {
    id: `${displayName}.errorAddingToken`,
    defaultMessage: `Sorry, there was an error adding this token. Learn more about tokens at: https://colony.io.`,
  },
});

type Props = DialogProps & Partial<WizardDialogType<object>> & ActionDialogProps;

const validationSchema = object({
  forceAction: boolean().defined(),
  tokenAddress: string().address().notRequired(),
  selectedTokenAddresses: array().of(string().address().defined()).notRequired(),
  annotationMessage: string().max(4000).notRequired(),
}).defined();

export type FormValues = InferType<typeof validationSchema>;

const TokenManagementDialog = ({ colony, cancel, close, callStep, prevStep, enabledExtensionData }: Props) => {
  const [isForce, setIsForce] = useState(false);
  const navigate = useNavigate();
  const colonyTokens = colony?.tokens?.items || [];

  const { isVotingReputationEnabled } = enabledExtensionData;

  const actionType =
    !isForce && isVotingReputationEnabled ? ActionTypes.MOTION_EDIT_COLONY : ActionTypes.ACTION_EDIT_COLONY;

  const transform = pipe(
    mapPayload((payload) => getTokenManagementDialogPayload(colony, payload)),
    withMeta({ navigate }),
  );

  const handleSuccess = () => close();
  const handleError = (error, formHelpers) => {
    const { setError } = formHelpers;
    setError('tokenAddress', { message: formatText(MSG.errorAddingToken) });
  };

  return (
    <Dialog cancel={cancel}>
      <Form<FormValues>
        actionType={actionType}
        defaultValues={{
          forceAction: false,
          tokenAddress: '',
          selectedTokenAddresses: colonyTokens.map((token) => token?.token.tokenAddress || ''),
          annotationMessage: '',
          /*
           * @NOTE That since this a root motion, and we don't actually make use
           * of the motion domain selected (it's disabled), we don't need to actually
           * pass the value over to the motion, since it will always be 1
           */
        }}
        validationSchema={validationSchema}
        transform={transform}
        onSuccess={handleSuccess}
        onError={handleError}
      >
        {({ watch }) => {
          const forceActionValue = watch('forceAction');
          if (forceActionValue !== isForce) {
            setIsForce(forceActionValue);
          }
          return (
            <TokenManagementDialogForm
              colony={colony}
              back={prevStep && callStep ? () => callStep(prevStep) : undefined}
              close={close}
              enabledExtensionData={enabledExtensionData}
            />
          );
        }}
      </Form>
    </Dialog>
  );
};

TokenManagementDialog.displayName = displayName;

export default TokenManagementDialog;
