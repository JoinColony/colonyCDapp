import React, { useState } from 'react';
import { defineMessages } from 'react-intl';
import { useNavigate } from 'react-router-dom';
import { string, object, array, boolean, InferType } from 'yup';
import { isAddress } from 'ethers/lib/utils';

import Dialog, { DialogProps, ActionDialogProps } from '~shared/Dialog';
import { ActionHookForm as Form } from '~shared/Fields';
import { ActionTypes } from '~redux/index';
import { pipe, mapPayload, withMeta } from '~utils/actions';
import { WizardDialogType } from '~hooks';
import { formatText } from '~utils/intl';
import { notNull } from '~utils/arrays';
import { Token } from '~types';

import { getTokenManagementDialogPayload } from './helpers';
import TokenManagementDialogForm from './TokenManagementDialogForm';

const displayName = 'common.TokenManagementDialog';

const MSG = defineMessages({
  errorAddingToken: {
    id: `${displayName}.errorAddingToken`,
    defaultMessage: `Sorry, there was an error adding this token. Learn more about tokens at: https://colony.io.`,
  },
  invalidAddress: {
    id: `${displayName}.invalidAddress`,
    defaultMessage: 'This is not a valid address',
  },
  tokenNotFound: {
    id: `${displayName}.tokenNotFound`,
    defaultMessage:
      'Token data not found. Please check the token contract address.',
  },
});

type Props = DialogProps &
  Partial<WizardDialogType<object>> &
  ActionDialogProps;

const validationSchema = object({
  forceAction: boolean().defined(),
  tokenAddress: string()
    .notRequired()
    .test(
      'is-address',
      () => MSG.invalidAddress,
      (value) => !value || isAddress(value),
    ),
  token: object<Token>()
    .nullable()
    .test('doesTokenExist', '', function doesTokenExist(value, context) {
      if (!context.parent.tokenAddress || !!value) {
        // Skip validation if tokenAddress is empty or token has been found
        return true;
      }

      return this.createError({
        message: formatText(MSG.tokenNotFound),
        path: 'tokenAddress',
      });
    }),
  selectedTokenAddresses: array()
    .of(string().address().defined())
    .notRequired(),
  annotationMessage: string().max(4000).notRequired(),
}).defined();

export type FormValues = InferType<typeof validationSchema>;

const TokenManagementDialog = ({
  colony,
  cancel,
  close,
  callStep,
  prevStep,
  enabledExtensionData,
}: Props) => {
  const [isForce, setIsForce] = useState(false);
  const navigate = useNavigate();
  const colonyTokens = colony?.tokens?.items.filter(notNull) || [];

  const { isVotingReputationEnabled } = enabledExtensionData;

  const actionType =
    !isForce && isVotingReputationEnabled
      ? ActionTypes.MOTION_EDIT_COLONY
      : ActionTypes.ACTION_EDIT_COLONY;

  const transform = pipe(
    mapPayload((payload) => getTokenManagementDialogPayload(colony, payload)),
    withMeta({ navigate }),
  );

  const handleSuccess = () => close();
  const handleError = (_, formHelpers) => {
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
          selectedTokenAddresses: colonyTokens.map(
            (token) => token?.token.tokenAddress,
          ),
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
        <TokenManagementDialogForm
          colony={colony}
          back={prevStep && callStep ? () => callStep(prevStep) : undefined}
          close={close}
          enabledExtensionData={enabledExtensionData}
          isForce={isForce}
          setIsForce={setIsForce}
        />
      </Form>
    </Dialog>
  );
};

TokenManagementDialog.displayName = displayName;

export default TokenManagementDialog;
