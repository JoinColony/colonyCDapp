import React, { useEffect, useState } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import { useSelector, useDispatch } from 'react-redux';
import { Navigate } from 'react-router-dom';

import { WizardStepProps } from '~shared/Wizard';
import NavLink from '~shared/NavLink';

import {
  getGroupStatus,
  findTransactionGroupByKey,
  getGroupKey,
  findNewestGroup,
  TransactionOrMessageGroups,
} from '~frame/GasStation/transactionGroup';
import { TRANSACTION_STATUSES } from '~types';
import { groupedTransactionsAndMessages } from '~redux/selectors';
import { ActionTypes } from '~redux/index';

import { FormValues, ConfirmTransactions } from '../CreateColonyWizard';

import styles from './StepConfirmTransactions.css';

const displayName = 'common.CreateColonyWizard.StepConfirmTransactions';

const MSG = defineMessages({
  heading: {
    id: `${displayName}.heading`,
    defaultMessage: `Complete these transactions to deploy
      your colony to the blockchain.`,
  },
  deploymentFailed: {
    id: `${displayName}.deploymentFailed`,
    defaultMessage: `An error occurred. Click {linkToColony} to go to your colony and continue`,
  },
  keywordHere: {
    id: `${displayName}.keywordHere`,
    defaultMessage: `here`,
  },
});

interface RecoverableDeploymentErrorProps {
  colonyName: string;
}

const RecoverableDeploymentError = ({
  colonyName,
}: RecoverableDeploymentErrorProps) => (
  <div className={styles.deploymentError}>
    <FormattedMessage
      {...MSG.deploymentFailed}
      values={{
        linkToColony: (
          <NavLink className={styles.linkToColony} to={`/colony/${colonyName}`}>
            <FormattedMessage {...MSG.keywordHere} />
          </NavLink>
        ),
      }}
    />
  </div>
);

type Props = Pick<WizardStepProps<FormValues>, 'wizardValues'>;

const StepConfirmTransactions = ({ wizardValues: { colonyName } }: Props) => {
  const [
    existsRecoverableDeploymentError,
    setExistsRecoverableDeploymentError,
  ] = useState<boolean>(false);
  const dispatch = useDispatch();

  const txGroups = useSelector(
    groupedTransactionsAndMessages,
  ).toJS() as TransactionOrMessageGroups;

  const newestGroup = findNewestGroup(txGroups);

  useEffect(() => {
    /*
     * Find out if the deployment failed, and we can actually recover it
     * Show an error message based on that
     */
    const colonyContractWasDeployed = (
      newestGroup as unknown as Array<{
        methodName: string;
        status: typeof TRANSACTION_STATUSES;
      }>
    ).find(
      ({ methodName = '', status = '' }) =>
        methodName.includes('createColony') &&
        status === TRANSACTION_STATUSES.SUCCEEDED,
    );
    const deploymentHasErrors =
      getGroupStatus(newestGroup) === TRANSACTION_STATUSES.FAILED;
    if (colonyContractWasDeployed && deploymentHasErrors) {
      setExistsRecoverableDeploymentError(true);
    } else if (existsRecoverableDeploymentError) {
      /*
       * Hide the error if the user pressed the retry button
       */
      setExistsRecoverableDeploymentError(false);
    }
  }, [
    newestGroup,
    existsRecoverableDeploymentError,
    setExistsRecoverableDeploymentError,
  ]);

  // Cancel the saga when the component unmounts
  useEffect(
    () => () => {
      dispatch({ type: ActionTypes.CREATE_CANCEL });
    },
    [dispatch],
  );

  // Redirect to the colony if a successful creteColony tx group is found
  if (
    getGroupStatus(newestGroup) === TRANSACTION_STATUSES.SUCCEEDED &&
    getGroupKey(newestGroup) === 'group.createColony'
  ) {
    return <Navigate to={`/colony/${colonyName}`} />;
  }

  const createColonyTxGroup = findTransactionGroupByKey(
    txGroups,
    'group.createColony',
  );

  return (
    <section className={styles.main}>
      <ConfirmTransactions
        transactionGroup={createColonyTxGroup}
        headingText={MSG.heading}
      />
      {existsRecoverableDeploymentError && (
        <RecoverableDeploymentError colonyName={colonyName} />
      )}
    </section>
  );
};

StepConfirmTransactions.displayName = displayName;

export default StepConfirmTransactions;
