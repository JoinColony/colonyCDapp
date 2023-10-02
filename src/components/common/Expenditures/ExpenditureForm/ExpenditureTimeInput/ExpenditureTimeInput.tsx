import React from 'react';

import { Input } from '~shared/Fields';

import styles from '../ExpenditureForm.module.css';

interface ExpenditureTimeInputProps {
  namePrefix: string;
  labelPrefix: string;
}

const ExpenditureTimeInput = ({
  namePrefix,
  labelPrefix,
}: ExpenditureTimeInputProps) => {
  return (
    <div className={styles.dateTime}>
      <Input
        name={`${namePrefix}Date`}
        label={`${labelPrefix} date`}
        formattingOptions={{
          date: true,
        }}
      />
      <Input
        name={`${namePrefix}Time`}
        label={`${labelPrefix} time`}
        formattingOptions={{
          time: true,
          timePattern: ['h', 'm'],
        }}
      />
    </div>
  );
};

export default ExpenditureTimeInput;
