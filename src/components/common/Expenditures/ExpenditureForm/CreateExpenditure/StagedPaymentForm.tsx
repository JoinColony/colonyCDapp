import React, { useState } from 'react';
import { Id } from '@colony/colony-js';
import { useNavigate } from 'react-router-dom';

import { ActionTypes } from '~redux';
import { useColonyContext, useEnabledExtensions } from '~hooks';
import { mapPayload, pipe, withMeta } from '~utils/actions';
import { findDomainByNativeId } from '~utils/domains';
import { CreateExpenditurePayload } from '~redux/sagas/expenditures/createExpenditure';
import Button from '~shared/Button';
import StakeExpenditureDialog from '~common/Expenditures/StakedExpenditure/StakeExpenditureDialog';

import CreateExpenditureForm from './CreateExpenditureForm';
import { StagedPaymentFormFields } from '../ExpenditureFormFields';
import { StagedPaymentFormValues } from '../types';
import {
  getInitialStageFieldValue,
  getStagedExpenditurePayouts,
} from '../helpers';

import styles from '../ExpenditureForm.module.css';

const StagedPaymentForm = () => {
  const navigate = useNavigate();

  const { colony } = useColonyContext();
  const { isStakedExpenditureEnabled } = useEnabledExtensions();

  const [isStakeDialogOpen, setIsStakeDialogOpen] = useState(false);

  if (!colony) {
    return null;
  }

  const isStakingRequired = isStakedExpenditureEnabled;

  const transformPayload = pipe(
    mapPayload((payload: StagedPaymentFormValues) => {
      return {
        ...payload,
        colony,
        createdInDomain: colony
          ? findDomainByNativeId(payload.createInDomainId, colony)
          : null,
        fundFromDomainId: payload.fundFromDomainId,
        payouts: getStagedExpenditurePayouts(payload),
        isStaged: true,
      } as CreateExpenditurePayload;
    }),
    withMeta({ navigate }),
  );

  return (
    <CreateExpenditureForm<StagedPaymentFormValues>
      actionType={
        isStakingRequired
          ? ActionTypes.STAKED_EXPENDITURE_CREATE
          : ActionTypes.EXPENDITURE_CREATE
      }
      defaultValues={{
        createInDomainId: Id.RootDomain,
        fundFromDomainId: Id.RootDomain,
        stages: [getInitialStageFieldValue(colony.nativeToken.tokenAddress)],
      }}
      transform={transformPayload}
    >
      {({ watch }) => {
        const formValues = watch();
        return (
          <>
            <StagedPaymentFormFields colony={colony} />
            <div className={styles.buttons}>
              <Button
                type={isStakingRequired ? 'button' : 'submit'}
                onClick={
                  isStakingRequired
                    ? () => setIsStakeDialogOpen(true)
                    : undefined
                }
              >
                Create
              </Button>
            </div>

            {isStakeDialogOpen && (
              <StakeExpenditureDialog
                colony={colony}
                onCancel={() => setIsStakeDialogOpen(false)}
                formValues={formValues}
                transform={transformPayload}
              />
            )}
          </>
        );
      }}
    </CreateExpenditureForm>
  );
};

export default StagedPaymentForm;
