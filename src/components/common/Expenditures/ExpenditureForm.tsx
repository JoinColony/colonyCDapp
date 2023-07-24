import React from 'react';

import { useColonyContext } from '~hooks';
import { Form, Input } from '~shared/Fields';

import styles from './ExpendituresPage.module.css';
import ExpenditureActionButton from './ExpenditureActionButton';

interface FormValues {
  recipientAddress: string;
  tokenAddress: string;
  amount: string;
}

const ExpenditureForm = () => {
  const { colony } = useColonyContext();

  return (
    <Form<FormValues>
      defaultValues={{
        recipientAddress: '',
        tokenAddress: colony?.nativeToken.tokenAddress ?? '',
        amount: '0',
      }}
      onSubmit={() => {}}
    >
      <div className={styles.form}>
        <Input name="recipientAddress" label="Recipient address" />
        <Input name="tokenAddress" label="Token address" />
        <Input name="amount" label="Amount" />
      </div>

      <ExpenditureActionButton />
    </Form>
  );
};

export default ExpenditureForm;
