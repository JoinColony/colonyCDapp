import React, { useState } from 'react';
import { Id } from '@colony/colony-js';
import { useNavigate } from 'react-router-dom';

import { ActionForm } from '~shared/Fields';
import { useColonyContext, useEnabledExtensions } from '~hooks';
import Button from '~shared/Button';
import { ActionTypes } from '~redux';

import {
  getCreateExpenditureTransformPayloadFn,
  getInitialPayoutFieldValue,
} from './helpers';
import { ExpenditureFormValues } from './types';
import ExpenditureFormFields from './ExpenditureFormFields';
import StakeExpenditureDialog from '../StakeExpenditureDialog';

import styles from './ExpenditureForm.module.css';

const CreateExpenditureForm = () => {
  const navigate = useNavigate();

  const { colony } = useColonyContext();
  const { isStakedExpenditureEnabled } = useEnabledExtensions();

  const [isStakeDialogOpen, setIsStakeDialogOpen] = useState(false);

  if (!colony) {
    return null;
  }

  /**
   * @TODO: This should include a permissions check as users with
   * administration permissions can create expenditures without staking
   */
  const isStakingRequired = isStakedExpenditureEnabled;

  return (
    <ActionForm<ExpenditureFormValues>
      actionType={ActionTypes.EXPENDITURE_CREATE}
      defaultValues={{
        payouts: [getInitialPayoutFieldValue(colony.nativeToken.tokenAddress)],
      }}
      transform={getCreateExpenditureTransformPayloadFn(colony, navigate)}
    >
      {({ watch }) => {
        const formValues = watch();

        return (
          <>
            <ExpenditureFormFields colony={colony} />

            <div className={styles.buttons}>
              <Button
                type={isStakingRequired ? 'button' : 'submit'}
                onClick={
                  isStakingRequired
                    ? () => setIsStakeDialogOpen(true)
                    : undefined
                }
              >
                Create expenditure
              </Button>
            </div>

            {isStakeDialogOpen && (
              <StakeExpenditureDialog
                colony={colony}
                selectedDomainId={Id.RootDomain}
                onCancel={() => setIsStakeDialogOpen(false)}
                formValues={formValues}
              />
            )}
          </>
        );
      }}
    </ActionForm>
  );
};

export default CreateExpenditureForm;
