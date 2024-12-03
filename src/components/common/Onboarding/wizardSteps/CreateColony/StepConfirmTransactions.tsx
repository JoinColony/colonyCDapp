import React, { useEffect, useState } from 'react';
import { defineMessages } from 'react-intl';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

import GroupedTransaction from '~common/Extensions/UserHub/partials/TransactionsTab/partials/GroupedTransaction.tsx';
import { useAppContext } from '~context/AppContext/AppContext.ts';
import { TransactionStatus } from '~gql';
import Toast from '~shared/Extensions/Toast/Toast.tsx';
import { SpinnerLoader } from '~shared/Preloaders/index.ts';
import { type WizardStepProps } from '~shared/Wizard/types.ts';
import {
  findTransactionGroupByKey,
  getGroupStatus,
  useGroupedTransactions,
} from '~state/transactionState.ts';
import { formatText } from '~utils/intl.ts';
import NotificationBanner from '~v5/shared/NotificationBanner/NotificationBanner.tsx';

import HeaderRow from '../HeaderRow.tsx';

import StepFinishCreate from './StepFinishCreate.tsx';
import { type FormValues } from './types.ts';

const displayName = 'common.CreateColonyWizard.StepConfirmTransactions';

const MSG = defineMessages({
  description: {
    id: `${displayName}.description`,
    defaultMessage:
      'Deploying to the blockchain requires you to sign a transaction in your wallet for each step.',
  },
  goBack: {
    id: `${displayName}.goBack`,
    defaultMessage: `go back`,
  },
  heading: {
    id: `${displayName}.heading`,
    defaultMessage: 'Complete setup',
  },
  loadingTransactions: {
    id: `${displayName}.loadingTransactions`,
    defaultMessage: `Waiting for transactions to be created...`,
  },
  loadingColony: {
    id: `${displayName}.loadingColony`,
    defaultMessage: `Waiting for your colony to exist...`,
  },
  failedTitle: {
    id: `${displayName}.failedTitle`,
    defaultMessage: `Colony creation process failed.`,
  },
  failedDescription: {
    id: `${displayName}.failedDescription`,
    defaultMessage: `Please try again.`,
  },
  partialFailure: {
    id: `${displayName}.partialFailure`,
    defaultMessage: `Colony creation process did not complete. Your Colony has still been created, but the token owner has not been set and extensions have not been installed. You can retry to complete the colony creation.`,
  },
  failedOnExtensions: {
    id: `${displayName}.failedOnExtensions`,
    defaultMessage: `Colony creation process did not complete. Your Colony has still been created, but the extensions have not been installed. You can manually install them in the extensions section of your colony.`,
  },
  goToColony: {
    id: `${displayName}.goToColony`,
    defaultMessage: `Go to your colony`,
  },
});

type Props = Pick<WizardStepProps<FormValues>, 'previousStep' | 'wizardValues'>;

const StepConfirmTransactions = (props: Props) => {
  const { previousStep } = props;

  const [createColonyFailed, setCreateColonyFailed] = useState(false);
  const [failedOnExtensions, setFailedOnExtensions] = useState(false);

  const { user, updateUser } = useAppContext();

  const { transactions } = useGroupedTransactions();

  const [createColonyTxs, setCreateColonyTxs] = useState<
    (typeof transactions)[0] | null
  >(null);

  useEffect(() => {
    const txGroup = findTransactionGroupByKey(transactions, 'createColony');
    if (!txGroup) {
      return;
    }
    const groupStatus = getGroupStatus(txGroup);
    if (groupStatus === TransactionStatus.Succeeded) {
      return;
    }

    setCreateColonyTxs(txGroup);
  }, [transactions]);

  const groupStatus = createColonyTxs
    ? getGroupStatus(createColonyTxs)
    : TransactionStatus.Pending;

  useEffect(() => {
    if (groupStatus === TransactionStatus.Succeeded) {
      updateUser(user?.walletAddress, true);
    }
  }, [groupStatus, updateUser, user]);

  const showErrorToast = () => {
    toast.error(
      <Toast
        type="error"
        title={formatText(MSG.failedTitle)}
        description={formatText(MSG.failedDescription)}
      />,
    );
  };

  useEffect(() => {
    if (!createColonyTxs) {
      return;
    }

    // Revert to previous step if first transaction failed
    if (
      createColonyTxs[0].methodName === 'createColonyForFrontend' &&
      createColonyTxs[0].status === TransactionStatus.Failed
    ) {
      showErrorToast();
      previousStep();
      return;
    }

    // Show retry form if the setOwner transaction fails
    if (
      createColonyTxs[1].methodName === 'setOwner' &&
      createColonyTxs[1].status === TransactionStatus.Failed
    ) {
      setCreateColonyFailed(true);
      return;
    }

    if (groupStatus === TransactionStatus.Failed) {
      setFailedOnExtensions(true);
    }
  }, [
    createColonyTxs,
    groupStatus,
    previousStep,
    setCreateColonyFailed,
    setFailedOnExtensions,
  ]);

  useEffect(() => {
    if (createColonyFailed) {
      showErrorToast();
    }
  }, [createColonyFailed]);

  if (!createColonyTxs) {
    return (
      <>
        <HeaderRow heading={MSG.heading} description={MSG.description} />
        <SpinnerLoader />
      </>
    );
  }

  if (failedOnExtensions) {
    const {
      wizardValues: { colonyName },
    } = props;

    return (
      <NotificationBanner
        status="error"
        callToAction={
          <Link
            to={`/${colonyName}`}
            state={{
              isRedirect: true,
              hasRecentlyCreatedColony: true,
            }}
          >
            {formatText(MSG.goToColony)}
          </Link>
        }
      >
        {formatText(MSG.failedOnExtensions)}
      </NotificationBanner>
    );
  }

  if (createColonyFailed) {
    const { wizardValues } = props;

    return (
      <>
        <NotificationBanner status="error">
          {formatText(MSG.partialFailure)}
        </NotificationBanner>
        <StepFinishCreate
          wizardValues={wizardValues}
          setFailedOnExtensions={setFailedOnExtensions}
        />
      </>
    );
  }

  return (
    <>
      <HeaderRow heading={MSG.heading} description={MSG.description} />
      <GroupedTransaction
        transactionGroup={createColonyTxs}
        isContentOpened
        hideSummary
        isClickable={false}
        isCancelable
      />
      {groupStatus === TransactionStatus.Succeeded && (
        <div className="mt-8 text-center text-sm text-gray-600">
          <SpinnerLoader />
          <span className="ml-2 align-text-bottom">
            {formatText(MSG.loadingColony)}
          </span>
        </div>
      )}
    </>
  );
};

StepConfirmTransactions.displayName = displayName;

export default StepConfirmTransactions;
