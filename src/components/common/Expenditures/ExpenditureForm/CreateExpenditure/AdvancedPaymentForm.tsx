import { Id } from '@colony/colony-js';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import StakeExpenditureDialog from '~common/Expenditures/StakedExpenditure/StakeExpenditureDialog';
import { useColonyContext, useEnabledExtensions } from '~hooks';
import { ActionTypes } from '~redux';
import { CreateExpenditurePayload } from '~redux/sagas/expenditures/createExpenditure';
import Button from '~shared/Button';
import { mapPayload, pipe, withMeta } from '~utils/actions';
import { findDomainByNativeId } from '~utils/domains';

import { AdvancedPaymentFormFields } from '../ExpenditureFormFields';
import { getInitialPayoutFieldValue } from '../helpers';
import { AdvancedPaymentFormValues } from '../types';

import CreateExpenditureForm from './CreateExpenditureForm';

import styles from '../ExpenditureForm.module.css';

const AdvancedPaymentForm = () => {
  const navigate = useNavigate();

  const { colony } = useColonyContext();
  const { isStakedExpenditureEnabled } = useEnabledExtensions();

  const [isStakeDialogOpen, setIsStakeDialogOpen] = useState(false);

  const isStakingRequired = isStakedExpenditureEnabled;

  const transformPayload = pipe(
    mapPayload((payload: AdvancedPaymentFormValues) => {
      return {
        ...payload,
        colony,
        createdInDomain: findDomainByNativeId(payload.createInDomainId, colony),
        fundFromDomainId: payload.fundFromDomainId,
        payouts: payload.payouts,
      } as CreateExpenditurePayload;
    }),
    withMeta({ navigate }),
  );

  return (
    <CreateExpenditureForm<AdvancedPaymentFormValues>
      actionType={
        isStakingRequired
          ? ActionTypes.STAKED_EXPENDITURE_CREATE
          : ActionTypes.EXPENDITURE_CREATE
      }
      defaultValues={{
        createInDomainId: Id.RootDomain,
        fundFromDomainId: Id.RootDomain,
        payouts: [getInitialPayoutFieldValue(colony.nativeToken.tokenAddress)],
      }}
      transform={transformPayload}
    >
      {({ watch }) => {
        const formValues = watch();
        return (
          <>
            <AdvancedPaymentFormFields colony={colony} />
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

export default AdvancedPaymentForm;
