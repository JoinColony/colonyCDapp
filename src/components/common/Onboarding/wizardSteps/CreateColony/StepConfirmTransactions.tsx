import React, { useEffect, useState } from 'react';
import { defineMessages } from 'react-intl';
import { useSelector } from 'react-redux';

import {
  getGroupStatus,
  findTransactionGroupByKey,
  getGroupKey,
  findNewestGroup,
  type TransactionOrMessageGroups,
} from '~common/Extensions/UserHub/partials/TransactionsTab/transactionGroup.ts';
import { useAppContext } from '~context/AppContext/AppContext.ts';
import { TransactionStatus } from '~gql';
import { groupedTransactionsAndMessages } from '~redux/selectors/index.ts';
import { type WizardStepProps } from '~shared/Wizard/types.ts';

import HeaderRow from '../HeaderRow.tsx';

import ConfirmTransactions from './ConfirmTransactions.tsx';
import { type FormValues } from './types.ts';

const displayName = 'common.CreateColonyWizard.StepConfirmTransactions';

const MSG = defineMessages({
  heading: {
    id: `${displayName}.heading`,
    defaultMessage: 'Complete setup',
  },
  description: {
    id: `${displayName}.description`,
    defaultMessage:
      'Deploying to the blockchain requires you to sign a transaction in your wallet for each step.',
  },
});

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

type Props = Pick<WizardStepProps<FormValues>, 'previousStep'>;

const StepConfirmTransactions = ({ previousStep }: Props) => {
  const [
    existsRecoverableDeploymentError,
    setExistsRecoverableDeploymentError,
  ] = useState<boolean>(false);
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
    if (!newestGroup) return;
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

  // @TODO: Move the following to the colonyCreate saga
  // Redirect to the colony if a successful creteColony tx group is found
  if (
    newestGroup &&
    getGroupStatus(newestGroup) === TransactionStatus.Succeeded &&
    getGroupKey(newestGroup) === 'group.createColony'
  ) {
    updateUser(user?.walletAddress, true);
  }

  // If the create colony transaction is cancelled at the first stage
  // there will be no newest group and we should go back to the confirm all inputs step
  if (!newestGroup) {
    previousStep();
  }

  const createColonyTxGroup = findTransactionGroupByKey(
    txGroups,
    'group.createColony',
  );

  return (
    <>
      <HeaderRow heading={MSG.heading} description={MSG.description} />
      <ConfirmTransactions transactionGroup={createColonyTxGroup} />
    </>
  );
};

StepConfirmTransactions.displayName = displayName;

export default StepConfirmTransactions;
