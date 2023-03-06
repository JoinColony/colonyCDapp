import React, { useCallback, useMemo, useState } from 'react';
import moveDecimal from 'move-decimal-point';
import { BigNumber } from 'ethers';
import { useNavigate } from 'react-router-dom';
import { defineMessages } from 'react-intl';
import { Id } from '@colony/colony-js';
import { string, object, number, boolean, InferType } from 'yup';
import Decimal from 'decimal.js';

import { pipe, mapPayload, withMeta } from '~utils/actions';
import { getTokenDecimalsWithFallback } from '~utils/tokens';
import { ActionTypes } from '~redux/index';
import Dialog, { ActionDialogProps, DialogProps } from '~shared/Dialog';
import { ActionHookForm as Form } from '~shared/Fields';
import { WizardDialogType } from '~hooks';
// import { useEnabledExtensions } from '~hooks/useEnabledExtensions';
import { sortBy } from '~utils/lodash';

import TransferFundsDialogForm from './TransferFundsDialogForm';

const MSG = defineMessages({
  amountZero: {
    id: 'common.ColonyHome.TransferFundsDialog.amountZero',
    defaultMessage: 'Amount must be greater than zero',
  },
  noBalance: {
    id: 'common.ColonyHome.TransferFundsDialog.noBalance',
    defaultMessage: 'Insufficient balance in from domain pot',
  },
});

type Props = Required<DialogProps> &
  WizardDialogType<object> &
  ActionDialogProps & {
    filteredDomainId?: number;
  };

const displayName = 'common.ColonyHome.TransferFundsDialog';

const validationSchema = object()
  .shape({
    forceAction: boolean().defined(),
    fromDomain: number().required(),
    toDomain: number().required(),
    amount: string()
      .required()
      .test(
        'more-than-zero',
        () => MSG.amountZero,
        (value) => {
          const numberWithouCommas = (value || '0').replace(/,/g, '');
          return !new Decimal(numberWithouCommas).isZero();
        },
      ),
    tokenAddress: string().address().required(),
    annotation: string().max(4000).defined(),
  })
  .defined();

export type FormValues = InferType<typeof validationSchema>;

const TransferFundsDialog = ({
  colony: {
    tokens,
    colonyAddress,
    name: colonyName,
    // version,
    domains,
    nativeToken,
  },
  colony,
  filteredDomainId: selectedDomainId,
  callStep,
  prevStep,
  cancel,
  close,
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
        ? ActionTypes[`MOTION_MOVE_FUNDS${actionEnd}`]
        : ActionTypes[`ACTION_MOVE_FUNDS${actionEnd}`];
    },
    [isForce], // , isVotingExtensionEnabled
  );

  const colonyDomains = useMemo(() => domains?.items || [], [domains]);
  const domainOptions = useMemo(
    () =>
      sortBy(
        colonyDomains.map((domain) => ({
          value: domain?.nativeId || '',
          label: domain?.name || `Domain #${domain?.nativeId}`,
        })),
        ['value'],
      ),

    [colonyDomains],
  );

  const colonyTokens = useMemo(() => tokens?.items || [], [tokens]);
  const transform = useCallback(
    () =>
      pipe(
        mapPayload(
          ({
            tokenAddress,
            amount: transferAmount,
            fromDomain: sourceDomain,
            toDomain,
            annotation: annotationMessage,
          }) => {
            const selectedToken = colonyTokens.find(
              (token) => token?.token.tokenAddress === tokenAddress,
            );
            const decimals = getTokenDecimalsWithFallback(
              selectedToken?.token.decimals,
            );

            // Convert amount string with decimals to BigInt (eth to wei)
            const amount = BigNumber.from(
              moveDecimal(transferAmount, decimals),
            );

            return {
              colonyAddress,
              colonyName,
              // version,
              fromDomainId: parseInt(sourceDomain, 10),
              toDomainId: parseInt(toDomain, 10),
              amount,
              tokenAddress,
              annotationMessage,
            };
          },
        ),
        withMeta({ navigate }),
      ),
    [colonyAddress, colonyTokens, colonyName, navigate],
  );

  return (
    <Form<FormValues>
      defaultValues={{
        forceAction: false,
        fromDomain: selectedDomainId || Id.RootDomain,
        toDomain:
          Number(
            domainOptions.find(
              (domain) => domain.value !== selectedDomainId?.toString(),
            )?.value,
          ) || Id.RootDomain,
        amount: '',
        tokenAddress: nativeToken.tokenAddress,
        annotation: '',
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
      {({ formState, getValues, trigger, setError }) => {
        const values = getValues();
        if (values.forceAction !== isForce) {
          setIsForce(values.forceAction);
        }
        return (
          <Dialog cancel={cancel}>
            <TransferFundsDialogForm
              {...formState}
              values={values}
              colony={colony}
              triggerValidation={trigger}
              setError={setError}
              domainOptions={domainOptions}
              back={prevStep && callStep ? () => callStep(prevStep) : undefined}
            />
          </Dialog>
        );
      }}
    </Form>
  );
};

TransferFundsDialog.displayName = displayName;

export default TransferFundsDialog;
