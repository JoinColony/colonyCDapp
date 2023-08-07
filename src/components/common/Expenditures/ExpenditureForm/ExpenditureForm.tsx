import React from 'react';

import { useColonyContext } from '~hooks';
import { Form } from '~shared/Fields';

import ExpenditureActionButton from '../ExpenditureActionButton';
import ExpenditureFormFields from './ExpenditureFormFields';

export interface ExpenditureSlotFieldValue {
  recipientAddress: string;
  tokenAddress: string;
  amount: string;
}

export interface ExpenditureFormValues {
  slots: ExpenditureSlotFieldValue[];
}

const ExpenditureForm = () => {
  const { colony } = useColonyContext();

  if (!colony) {
    return null;
  }

  return (
    <Form<ExpenditureFormValues>
      defaultValues={{
        slots: [
          {
            recipientAddress: '',
            tokenAddress: colony?.nativeToken.tokenAddress ?? '',
            amount: '0',
          },
        ],
      }}
      onSubmit={() => {}}
    >
      <>
        <ExpenditureFormFields colony={colony} />

        <ExpenditureActionButton />
      </>
    </Form>
  );
};

export default ExpenditureForm;
