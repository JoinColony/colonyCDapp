import React, { useCallback, useState } from 'react';
import { defineMessages } from 'react-intl';
import { string, object, bool, InferType } from 'yup';
import { useNavigate } from 'react-router-dom';
import { BigNumber } from 'ethers';
import moveDecimal from 'move-decimal-point';
import Decimal from 'decimal.js';

import Dialog, { DialogProps, ActionDialogProps } from '~shared/Dialog';
import { ActionHookForm as Form } from '~shared/Fields';

import { ActionTypes } from '~redux/index';
import { RootMotionMethodNames } from '~redux/types/actions';
import { pipe, mapPayload, withMeta } from '~utils/actions';
import { getTokenDecimalsWithFallback } from '~utils/tokens';
import { WizardDialogType } from '~hooks'; // useEnabledExtensions

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
    annotation: string().max(4000).defined(),
    mintAmount: string()
      .required(() => MSG.errorAmountRequired)
      .test(
        'more-than-zero',
        () => MSG.errorAmountMin,
        (value) => {
          const numberWithouCommas = (value || '0').replace(/,/g, '');
          return !new Decimal(numberWithouCommas).isZero();
        },
      ),
  })
  .defined();

type FormValues = InferType<typeof validationSchema>;

const MintTokenDialog = ({
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
      : ActionTypes[`ACTION_MINT_TOKENS${actionEnd}`];
  };

  const transform = useCallback(
    () =>
      pipe(
        mapPayload(
          ({ mintAmount: inputAmount, annotation: annotationMessage }) => {
            // Find the selected token's decimals
            const amount = BigNumber.from(
              moveDecimal(
                inputAmount,
                getTokenDecimalsWithFallback(colony?.nativeToken?.decimals),
              ),
            );
            return {
              operationName: RootMotionMethodNames.MintTokens,
              colonyAddress: colony?.colonyAddress,
              colonyName: colony?.name,
              nativeTokenAddress: colony?.nativeToken?.tokenAddress,
              motionParams: [amount],
              amount,
              annotationMessage,
            };
          },
        ),
        withMeta({ navigate }),
      ),
    [colony, navigate],
  );

  return (
    <Form<FormValues>
      defaultValues={{
        forceAction: false,
        annotation: '',
        mintAmount: '',
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
            <MintTokenDialogForm
              colony={colony}
              back={prevStep && callStep ? () => callStep(prevStep) : undefined}
            />
          </Dialog>
        );
      }}
    </Form>
  );
};

MintTokenDialog.displayName = displayName;

export default MintTokenDialog;
