import React, { useState } from 'react';
import { Id } from '@colony/colony-js';
import { useNavigate } from 'react-router-dom';

import { ActionForm } from '~shared/Fields';
import { useColonyContext, useEnabledExtensions } from '~hooks';
import Button from '~shared/Button';
import { ActionTypes } from '~redux';
import { Tab, TabList, TabPanel, Tabs } from '~shared/Tabs';

import {
  getCreateExpenditureTransformPayloadFn,
  getInitialPayoutFieldValue,
  getInitialStageFieldValue,
} from './helpers';
import { ExpenditureFormType, ExpenditureFormValues } from './types';
import StakeExpenditureDialog from '../StakedExpenditure/StakeExpenditureDialog';
import ExpenditureDomainSelector from './ExpenditureDomainSelector/ExpenditureDomainSelector';
import {
  AdvancedPaymentFormFields,
  StagedPaymentFormFields,
} from './ExpenditureFormFields';

import styles from './ExpenditureForm.module.css';

const CreateExpenditureForm = () => {
  const navigate = useNavigate();

  const { colony } = useColonyContext();
  const { isStakedExpenditureEnabled } = useEnabledExtensions();

  const [isStakeDialogOpen, setIsStakeDialogOpen] = useState(false);

  if (!colony) {
    return null;
  }

  const formTypeOptions = [
    {
      type: ExpenditureFormType.Advanced,
      label: 'Advanced Payment',
      component: <AdvancedPaymentFormFields colony={colony} />,
    },
    {
      type: ExpenditureFormType.Staged,
      label: 'Staged Payment',
      component: <StagedPaymentFormFields colony={colony} />,
    },
  ];

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
        formType: ExpenditureFormType.Advanced,
        stages: [getInitialStageFieldValue(colony.nativeToken.tokenAddress)],
      }}
      transform={getCreateExpenditureTransformPayloadFn(colony, navigate)}
    >
      {({ watch, setValue }) => {
        const formValues = watch();

        return (
          <>
            <ExpenditureDomainSelector colony={colony} />

            <Tabs
              onSelect={(index) =>
                setValue('formType', formTypeOptions[index].type)
              }
            >
              <TabList containerClassName={styles.typeTabs}>
                {formTypeOptions.map(({ type, label }) => (
                  <Tab key={type}>{label}</Tab>
                ))}
              </TabList>
              {formTypeOptions.map(({ type, component }) => (
                <TabPanel key={type}>{component}</TabPanel>
              ))}
            </Tabs>

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
