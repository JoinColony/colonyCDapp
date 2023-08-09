import React from 'react';
import { weiToEth } from '@web3-onboard/common';
import { Id } from '@colony/colony-js';
import { useNavigate } from 'react-router-dom';

import { useColonyContext } from '~hooks';
import { ActionForm } from '~shared/Fields';
import { Expenditure } from '~types';
import { ActionTypes } from '~redux';
import { mapPayload, pipe, withMeta } from '~utils/actions';

import ExpenditureFormFields from './ExpenditureFormFields';
import { getInitialSlotFieldValue } from './helpers';

export interface ExpenditureSlotFieldValue {
  recipientAddress: string;
  tokenAddress: string;
  amount: string;
}

export interface ExpenditureFormValues {
  slots: ExpenditureSlotFieldValue[];
}

export interface ExpenditureFormProps {
  expenditure?: Expenditure;
  submitButtonText?: string;
}

const ExpenditureForm = ({ expenditure, ...props }: ExpenditureFormProps) => {
  const navigate = useNavigate();

  const { colony } = useColonyContext();

  if (!colony) {
    return null;
  }

  const transformCreateExpenditurePayload = pipe(
    mapPayload((payload: ExpenditureFormValues) => ({
      colony,
      slots: payload.slots,
      // @TODO: This should come from the form values
      domainId: Id.RootDomain,
    })),
    withMeta({ navigate }),
  );

  return (
    <ActionForm
      defaultValues={{
        slots: expenditure?.slots.map<ExpenditureSlotFieldValue>((slot) => ({
          recipientAddress: slot.recipientAddress ?? '',
          tokenAddress: slot.payouts?.[0]?.tokenAddress ?? '',
          amount: weiToEth(slot.payouts?.[0]?.amount.toString() ?? '0'),
        })) ?? [getInitialSlotFieldValue(colony.nativeToken.tokenAddress)],
      }}
      actionType={ActionTypes.EXPENDITURE_CREATE}
      transform={transformCreateExpenditurePayload}
    >
      <ExpenditureFormFields {...props} colony={colony} />
    </ActionForm>
  );
};

export default ExpenditureForm;
