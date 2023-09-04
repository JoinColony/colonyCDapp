import React, { useState } from 'react';
import { Id } from '@colony/colony-js';
import { useNavigate } from 'react-router-dom';

import { ActionForm } from '~shared/Fields';
import { useColonyContext, useEnabledExtensions } from '~hooks';
import Button from '~shared/Button';
import { ActionTypes } from '~redux';
import { Tab, TabList, Tabs } from '~shared/Tabs';

import {
  getCreateExpenditureTransformPayloadFn,
  getInitialPayoutFieldValue,
} from './helpers';
import { ExpenditureFormType, ExpenditureFormValues } from './types';
import ExpenditureFormFields from './ExpenditureFormFields';
import StakeExpenditureDialog from '../StakedExpenditure/StakeExpenditureDialog';

import styles from './ExpenditureForm.module.css';
import ExpenditureDomainSelector from './ExpenditureDomainSelector/ExpenditureDomainSelector';

const formTypeOptions = [
  {
    type: ExpenditureFormType.Advanced,
    label: 'Advanced Payment',
  },
  {
    type: ExpenditureFormType.Staged,
    label: 'Staged Payment',
  },
];

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
        createInDomainId: Id.RootDomain,
        fundFromDomainId: Id.RootDomain,
        type: ExpenditureFormType.Advanced,
      }}
      transform={getCreateExpenditureTransformPayloadFn(colony, navigate)}
    >
      {({ watch }) => {
        const formValues = watch();

        return (
          <>
            <ExpenditureDomainSelector colony={colony} />

            <Tabs>
              <TabList containerClassName={styles.typeTabs}>
                {formTypeOptions.map(({ type, label }) => (
                  <Tab key={type}>{label}</Tab>
                ))}
              </TabList>
            </Tabs>

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
