import React from 'react';
import { weiToEth } from '@web3-onboard/common';

import { useColonyContext } from '~hooks';
import { Form } from '~shared/Fields';

import ExpenditureActionButton from '../ExpenditureActionButton';
import ExpenditureFormFields from './ExpenditureFormFields';
import { getInitialSlotFieldValue } from './helpers';
import { Expenditure } from '~types';

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
  const { colony } = useColonyContext();

  if (!colony) {
    return null;
  }

  return (
    <Form<ExpenditureFormValues>
      defaultValues={{
        slots: expenditure?.slots.map<ExpenditureSlotFieldValue>((slot) => ({
          recipientAddress: slot.recipientAddress ?? '',
          tokenAddress: slot.payouts?.[0]?.tokenAddress ?? '',
          amount: weiToEth(slot.payouts?.[0]?.amount.toString() ?? '0'),
        })) ?? [getInitialSlotFieldValue(colony.nativeToken.tokenAddress)],
      }}
      onSubmit={() => {}}
    >
      <ExpenditureFormFields {...props} colony={colony} />
      <ExpenditureActionButton />
    </Form>
  );
};

export default ExpenditureForm;
