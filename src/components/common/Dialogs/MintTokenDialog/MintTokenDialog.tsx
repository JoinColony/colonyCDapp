import React, { useCallback, useState } from 'react';
import { defineMessages } from 'react-intl';
import * as yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { BigNumber } from 'ethers';
import moveDecimal from 'move-decimal-point';

import Dialog, { DialogProps, ActionDialogProps } from '~shared/Dialog';
import { ActionHookForm as Form } from '~shared/Fields';

import { ActionTypes } from '~redux/index';
import { RootMotionOperationNames } from '~redux/types/actions';
import { pipe, mapPayload, withMeta } from '~utils/actions';
import { getTokenDecimalsWithFallback } from '~utils/tokens';
import { WizardDialogType } from '~hooks'; // useEnabledExtensions
import { toFinite } from '~utils/lodash';

import MintTokenDialogForm from './MintTokenDialogForm';

const displayName = 'common.ColonyHome.MintTokenDialog';

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

export interface FormValues {
  forceAction: boolean;
  annotation: string;
  mintAmount: number;
}

type Props = DialogProps &
  Partial<WizardDialogType<object>> &
  ActionDialogProps;

const validationSchema = yup
  .object()
  .shape({
    forceAction: yup.bool().defined(),
    annotation: yup.string().max(4000).defined(),
    mintAmount: yup
      .number()
      .transform((value) => toFinite(value))
      .required(() => MSG.errorAmountRequired)
      .moreThan(0, () => MSG.errorAmountMin),
  })
  .defined();

const MintTokenDialog = ({
  colony: { nativeToken, colonyAddress, name: colonyName },
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
        : ActionTypes[`ACTION_MINT_TOKENS${actionEnd}`];
    },
    [isForce], // , isVotingExtensionEnabled
  );

  const transform = useCallback(
    () =>
      pipe(
        mapPayload(
          ({ mintAmount: inputAmount, annotation: annotationMessage }) => {
            // Find the selected token's decimals
            const amount = BigNumber.from(
              moveDecimal(
                inputAmount,
                getTokenDecimalsWithFallback(nativeToken?.decimals),
              ),
            );
            return {
              operationName: RootMotionOperationNames.MINT_TOKENS,
              colonyAddress,
              colonyName,
              nativeTokenAddress: nativeToken?.tokenAddress,
              motionParams: [amount],
              amount,
              annotationMessage,
            };
          },
        ),
        withMeta({ navigate }),
      ),
    [colonyAddress, colonyName, nativeToken, navigate],
  );

  return (
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
            <MintTokenDialogForm
              {...formState}
              values={values}
              colony={colony}
              back={prevStep && callStep ? () => callStep(prevStep) : undefined}
              nativeToken={nativeToken}
            />
          </Dialog>
        );
      }}
    </Form>
  );
};

MintTokenDialog.displayName = displayName;

export default MintTokenDialog;
