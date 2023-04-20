import { MessageDescriptor } from 'react-intl';
import React from 'react';

import Heading from '~shared/Heading';
import { useAppContext } from '~hooks';

import { FormValues } from '../CreateColonyWizard';

import styles from './CreateColonyCardRow.css';

export type Row = GenericRow | TokenRow;

interface GenericRow {
  title: MessageDescriptor;
  valueKey: string;
}

interface TokenRow extends Omit<GenericRow, 'valueKey'> {
  valueKey: [string, string];
}

interface CardProps {
  cardOptions: Row[];
  values: FormValues;
}

const formatUsername = (username: string) => {
  return (
    <span title={`@${username}`} className={styles.username}>
      {`@${username}`}
    </span>
  );
};

const formatColonyName = (values: FormValues, { valueKey }: GenericRow) => {
  return (
    <>
      <span title={values.displayName} className={styles.firstValue}>
        {values.displayName}
      </span>
      <span title={`(colony.io/colony/${values[valueKey]})`} className={styles.secondValue}>
        {`(colony.io/colony/${values[valueKey]})`}
      </span>
    </>
  );
};

const formatToken = (values: FormValues, { valueKey }: TokenRow) => (
  <>
    <span title={values[valueKey[0]]} className={styles.tokenSymbol}>
      {values[valueKey[0]]}
    </span>
    <span title={`(${values[valueKey[1]]})`} className={styles.tokenName}>
      {`(${values[valueKey[1]]})`}
    </span>
  </>
);

const getHeadingPreviewText = (option: Row, values: CardProps['values'], username: string) => {
  if (option.valueKey === 'colonyName') {
    return formatColonyName(values, option as GenericRow);
  }
  if (option.valueKey === 'username') {
    return formatUsername(username);
  }
  return formatToken(values, option as TokenRow);
};

const displayName = 'common.CreateColonyWizard.CardRow';

const CardRow = ({ cardOptions, values }: CardProps) => {
  const { user } = useAppContext();
  const username = user?.profile?.displayName || user?.name || '';

  return (
    <>
      {cardOptions.map((option) => (
        <div className={styles.cardRow} key={`option ${option.valueKey[0]}`}>
          <Heading appearance={{ size: 'tiny', weight: 'medium', margin: 'small' }} text={option.title} />
          <Heading appearance={{ size: 'normal', weight: 'thin', margin: 'none' }}>
            {getHeadingPreviewText(option, values, username)}
          </Heading>
        </div>
      ))}
    </>
  );
};

CardRow.displayName = displayName;

export default CardRow;
