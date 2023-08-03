import React from 'react';

import { useColonyContext } from '~hooks';
import { Form, Input } from '~shared/Fields';

import ExpenditureActionButton from './ExpenditureActionButton';

import styles from './ExpendituresPage/ExpendituresPage.module.css';

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
        <div className={styles.amountField}>
          <Input name="amount" label="Amount" />
          <div>{colony?.nativeToken.symbol}</div>
        </div>
      </div>

      <ExpenditureActionButton />
    </Form>
  );
};

export default ExpenditureForm;
