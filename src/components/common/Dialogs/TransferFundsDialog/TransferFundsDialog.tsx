import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { defineMessages } from 'react-intl';
import { Id } from '@colony/colony-js';
import { string, object, number, boolean, InferType } from 'yup';
import Decimal from 'decimal.js';

import { notNull } from '~utils/arrays';
import { pipe, mapPayload, withMeta } from '~utils/actions';
import { ActionTypes } from '~redux/index';
import Dialog, { ActionDialogProps, DialogProps } from '~shared/Dialog';
import { ActionHookForm as Form } from '~shared/Fields';
import { getDomainOptions } from '~shared/DomainFundSelectorSection/helpers';
import { WizardDialogType } from '~hooks';

import TransferFundsDialogForm from './TransferFundsDialogForm';
import { getTransferFundsDialogPayload } from './helpers';

const displayName = 'common.TransferFundsDialog';

const MSG = defineMessages({
  requiredFieldError: {
    id: `${displayName}.requiredFieldError`,
    defaultMessage: 'Please enter a value',
  },
  amountZero: {
    id: `${displayName}.amountZero`,
    defaultMessage: 'Amount must be greater than zero',
  },
  sameDomain: {
    id: `${displayName}.sameDomain`,
    defaultMessage: 'Cannot move to same team pot',
  },
});

type Props = Required<DialogProps> &
  WizardDialogType<object> &
  ActionDialogProps & {
    filteredDomainId?: number;
  };

function checkIfSameDomain(value: number) {
  const oppositeDomain =
    this.parent[this.path === 'fromDomain' ? 'toDomain' : 'fromDomain'];
  return oppositeDomain !== value;
}

const validationSchema = object()
  .shape({
    forceAction: boolean().defined(),
    fromDomain: number()
      .required()
      .test('same-domain', () => MSG.sameDomain, checkIfSameDomain),
    toDomain: number()
      .required()
      .test('same-domain', () => MSG.sameDomain, checkIfSameDomain),
    amount: string()
      .required(() => MSG.requiredFieldError)
      .test(
        'more-than-zero',
        () => MSG.amountZero,
        (value) => {
          const numberWithoutCommas = (value || '0').replace(/,/g, ''); // @TODO: Remove this once the fix for FormattedInputComponent value is introduced.
          return !new Decimal(numberWithoutCommas).isZero();
        },
      ),
    tokenAddress: string().address().required(),
    annotation: string().max(4000).defined(),
  })
  .defined();

type FormValues = InferType<typeof validationSchema>;

const TransferFundsDialog = ({
  colony,
  filteredDomainId: selectedDomainId,
  callStep,
  prevStep,
  cancel,
  close,
  enabledExtensionData,
}: Props) => {
  const [isForce, setIsForce] = useState(false);
  const navigate = useNavigate();

  const { isVotingReputationEnabled } = enabledExtensionData;

  const actionType =
    !isForce && isVotingReputationEnabled
      ? ActionTypes.MOTION_MOVE_FUNDS
      : ActionTypes.ACTION_MOVE_FUNDS;

  const colonyDomains = colony?.domains?.items.filter(notNull) || [];
  const domainOptions = getDomainOptions(colonyDomains);

  const transform = pipe(
    mapPayload((payload) => getTransferFundsDialogPayload(colony, payload)),
    withMeta({ navigate }),
  );

  return (
    <Dialog cancel={cancel}>
      <Form<FormValues>
        defaultValues={{
          forceAction: false,
          fromDomain: selectedDomainId || Id.RootDomain,
          toDomain:
            Number(
              domainOptions.find((domain) => domain.value !== selectedDomainId)
                ?.value,
            ) || Id.RootDomain,
          amount: '',
          tokenAddress: colony?.nativeToken.tokenAddress,
          annotation: '',
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
            <TransferFundsDialogForm
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

TransferFundsDialog.displayName = displayName;

export default TransferFundsDialog;
