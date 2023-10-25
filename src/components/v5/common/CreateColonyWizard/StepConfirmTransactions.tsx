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
import { TransactionStatus } from '~gql';
import { groupedTransactionsAndMessages } from '~redux/selectors';
import { ActionTypes } from '~redux/index';
import { useAppContext } from '~hooks';

import { FormValues } from '../CreateColonyWizard';
import ConfirmTransactions from './ConfirmTransactions';
import { HeaderRow } from './shared';

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
  <div className="">
    <FormattedMessage
      {...MSG.deploymentFailed}
      values={{
        linkToColony: (
          <NavLink className="" to={`/colony/${colonyName}`}>
            <FormattedMessage {...MSG.keywordHere} />
          </NavLink>
        ),
      }}
    />
  </div>
);

type Props = Pick<WizardStepProps<FormValues>, 'wizardValues'>;

type NewestGroup = Array<{
  methodName: string;
  status: typeof TransactionStatus;
}>;

const getContractDeploymentStatus = (newestGroup: NewestGroup) =>
  !!newestGroup.find(
    ({ methodName = '', status = '' }) =>
      methodName.includes('createColony') &&
      status === TransactionStatus.Succeeded,
  );

const StepConfirmTransactions = ({ wizardValues: { colonyName } }: Props) => {
  const [
    existsRecoverableDeploymentError,
    setExistsRecoverableDeploymentError,
  ] = useState<boolean>(false);
  const dispatch = useDispatch();
  const { user, updateUser } = useAppContext();

  const txGroups = useSelector(
    groupedTransactionsAndMessages,
  ).toJS() as TransactionOrMessageGroups;

  const newestGroup = findNewestGroup(txGroups);

  useEffect(() => {
    /*
     * Find out if the deployment failed, and we can actually recover it
     * Show an error message based on that
     */
    const colonyContractWasDeployed = getContractDeploymentStatus(
      newestGroup as unknown as NewestGroup,
    );
    const deploymentHasErrors =
      getGroupStatus(newestGroup) === TransactionStatus.Failed;
    if (colonyContractWasDeployed && deploymentHasErrors) {
      setExistsRecoverableDeploymentError(true);
    } else if (existsRecoverableDeploymentError) {
      // Hide the error if the user pressed the retry button
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

  // @TODO: Move the following to the colonyCreate saga
  // Redirect to the colony if a successful creteColony tx group is found
  if (
    getGroupStatus(newestGroup) === TransactionStatus.Succeeded &&
    getGroupKey(newestGroup) === 'group.createColony'
  ) {
    updateUser?.(user?.walletAddress, true);
    return (
      <Navigate to={`/colony/${colonyName}`} state={{ isRedirect: true }} />
    );
  }

  const createColonyTxGroup = findTransactionGroupByKey(
    txGroups,
    'group.createColony',
  );

  return (
    <section className="">
      <HeaderRow
        heading={{ id: 'createColonyWizard.step.transactions.heading' }}
        description={{ id: 'createColonyWizard.step.transactiosn.description' }}
      />
      <ConfirmTransactions transactionGroup={createColonyTxGroup} />
      {existsRecoverableDeploymentError && (
        <RecoverableDeploymentError colonyName={colonyName} />
      )}
    </section>
  );
};

StepConfirmTransactions.displayName = displayName;

export default StepConfirmTransactions;
