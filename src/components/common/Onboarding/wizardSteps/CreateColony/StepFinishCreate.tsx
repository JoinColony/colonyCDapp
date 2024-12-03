import { SpinnerGap } from '@phosphor-icons/react';
import React, { useEffect, useState } from 'react';
import { defineMessages } from 'react-intl';
import { useNavigate } from 'react-router-dom';

import useAsyncFunction from '~hooks/useAsyncFunction.ts';
import { ActionTypes } from '~redux';
import { Form } from '~shared/Fields/index.ts';
import { type WizardStepProps } from '~shared/Wizard/types.ts';
import {
  findTransactionGroupByKey,
  getGroupStatus,
  useGroupedTransactions,
} from '~state/transactionState.ts';
import { TransactionStatus } from '~types/graphql.ts';
import { pipe, withMeta } from '~utils/actions.ts';
import { formatText } from '~utils/intl.ts';
import IconButton from '~v5/shared/Button/IconButton.tsx';
import Button from '~v5/shared/Button/index.ts';

import { type FormValues } from './types.ts';

const displayName = 'common.CreateColonyWizard.StepFinishCreate';

const MSG = defineMessages({
  retry: {
    id: `${displayName}.retry`,
    defaultMessage: 'Retry',
  },
});

type Props = Pick<WizardStepProps<FormValues>, 'wizardValues'> & {
  setFailedOnExtensions: (failedOnExtensions: boolean) => void;
};

const StepFinishCreate = ({
  wizardValues: { tokenChoice, colonyName },
  setFailedOnExtensions,
}: Props) => {
  const navigate = useNavigate();

  const { transactions } = useGroupedTransactions();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const [finishCreateColonyTxs, setFinishCreateColonyTxs] = useState<
    (typeof transactions)[0] | null
  >(null);

  // Find the first finishColonyCreation tx group that is still pending and then set it to the finish colony creation tx group
  useEffect(() => {
    if (!hasSubmitted) {
      return;
    }

    const finishCreateColonyTxGroup = findTransactionGroupByKey(
      transactions,
      'finishCreateColony',
    );

    if (!finishCreateColonyTxGroup) {
      return;
    }
    const groupStatus = getGroupStatus(finishCreateColonyTxGroup);
    if (groupStatus === TransactionStatus.Succeeded) {
      return;
    }

    setFinishCreateColonyTxs(finishCreateColonyTxGroup);
  }, [hasSubmitted, transactions]);

  const groupStatus = finishCreateColonyTxs
    ? getGroupStatus(finishCreateColonyTxs)
    : TransactionStatus.Pending;

  useEffect(() => {
    if (!finishCreateColonyTxs) {
      return;
    }

    if (
      finishCreateColonyTxs[0].methodName === 'setOwner' &&
      finishCreateColonyTxs[0].status === TransactionStatus.Failed
    ) {
      return;
    }

    if (groupStatus === TransactionStatus.Failed) {
      setFailedOnExtensions(true);
    }
  }, [finishCreateColonyTxs, groupStatus, isSubmitting, setFailedOnExtensions]);

  // @TODO: Fail the previous create colony transactions when attempting this
  const transform = pipe(withMeta({ navigate }));

  const finishCreateColony = useAsyncFunction({
    submit: ActionTypes.FINISH_CREATE,
    error: ActionTypes.FINISH_CREATE_ERROR,
    success: ActionTypes.FINISH_CREATE_SUCCESS,
    transform,
  });

  const handleSubmit = async () => {
    setHasSubmitted(true);
    setIsSubmitting(true);
    try {
      await finishCreateColony({
        colonyName,
        tokenChoice,
      });
    } catch {
      //
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      {isSubmitting ? (
        <IconButton
          className="w-full !text-md"
          rounded="s"
          text={{ id: 'button.pending' }}
          icon={
            <span className="ml-1.5 flex shrink-0">
              <SpinnerGap className="animate-spin" size={18} />
            </span>
          }
        />
      ) : (
        <Button mode="primarySolid" isFullSize type="submit">
          {formatText(MSG.retry)}
        </Button>
      )}
    </Form>
  );
};

StepFinishCreate.displayName = displayName;

export default StepFinishCreate;
