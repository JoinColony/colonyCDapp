import React from 'react';
import { defineMessages } from 'react-intl';
import { useParams } from 'react-router-dom';

import { Heading3 } from '~shared/Heading';
import Button from '~shared/Button';
import NakedMoleImage from '~images/naked-mole.svg';

import { STATUS_MAP } from '../staticMaps';
import TransactionHash from './TransactionHash';
import { TransactionMetaProps } from '../TransactionMeta';
import { ActionDetailsPageParams } from '../ActionDetailsPage';

import styles from './TransactionNotFound.css';

const displayName = 'common.ColonyActions.ActionDetailsPage.TransactionNotFound';

const MSG = defineMessages({
  returnToColony: {
    id: `${displayName}.returnToColony`,
    defaultMessage: `Return to colony`,
  },
  transactionNotFound: {
    id: `${displayName}.transactionNotFound`,
    defaultMessage: `Ooops, action not found`,
  },
  unknownTransaction: {
    id: `${displayName}.unknownTransaction`,
    defaultMessage: `Unknown Transaction`,
  },
});

interface TransactionNotFoundProps {
  colonyName?: string;
  createdAt?: TransactionMetaProps['createdAt'];
  status?: number;
  isUnknownTx: boolean;
}

const TransactionNotFound = ({ colonyName, createdAt, status, isUnknownTx }: TransactionNotFoundProps) => {
  const { transactionHash } = useParams<ActionDetailsPageParams>();
  return (
    <div className={styles.notFoundContainer}>
      <NakedMoleImage />
      <Heading3
        text={isUnknownTx ? MSG.unknownTransaction : MSG.transactionNotFound}
        appearance={{
          weight: 'medium',
          theme: 'dark',
        }}
      />
      <Button
        title={MSG.returnToColony}
        text={MSG.returnToColony}
        linkTo={`/colony/${colonyName}`}
        appearance={{
          theme: 'primary',
          size: 'large',
        }}
      />
      <div className={styles.divider} />
      <TransactionHash
        showMeta={isUnknownTx}
        transactionHash={transactionHash}
        createdAt={createdAt}
        status={isUnknownTx ? STATUS_MAP[status ?? ''] : undefined}
      />
    </div>
  );
};

TransactionNotFound.displayName = displayName;

export default TransactionNotFound;
