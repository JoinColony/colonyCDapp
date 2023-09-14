import React from 'react';
import { useNavigate } from 'react-router-dom';

import Dialog, { DialogSection } from '~shared/Dialog';
import { Colony } from '~types';

import { SpinnerLoader } from '~shared/Preloaders';
import { useAppContext } from '~hooks';
import { Heading3 } from '~shared/Heading';
import Numeral from '~shared/Numeral';
import { ActionButton } from '~shared/Button';
import { ActionTypes } from '~redux';

import {
  CreateExpenditureFormValues,
  getCreateExpenditureTransformPayloadFn,
} from '../../ExpenditureForm';
import useExpenditureStaking from './useExpenditureStaking';

import styles from './StakeExpenditureDialog.module.css';

interface StakeExpenditureDialogProps {
  colony: Colony;
  onCancel: () => void;
  formValues: CreateExpenditureFormValues;
}

const StakeExpenditureDialog = ({
  colony,
  onCancel,
  formValues,
}: StakeExpenditureDialogProps) => {
  const navigate = useNavigate();

  const { user } = useAppContext();

  const { stakeAmount, stakedExpenditureAddress, hasEnoughTokens, isLoading } =
    useExpenditureStaking(
      colony,
      user?.walletAddress ?? '',
      formValues.createInDomainId,
    );

  return (
    <Dialog cancel={onCancel}>
      <DialogSection>
        <Heading3 appearance={{ margin: 'none' }}>
          Stake to create the payment
        </Heading3>
      </DialogSection>
      <DialogSection>
        {isLoading && (
          <div className={styles.loader}>
            <SpinnerLoader appearance={{ size: 'large' }} />
          </div>
        )}

        {!isLoading && !stakeAmount && (
          <div>
            Could not get the required stake amount. There might be no
            reputation in the selected domain.
          </div>
        )}

        {!isLoading && stakeAmount && (
          <div>
            <div className={styles.requiredStake}>
              <div>Required stake amount:</div>
              <div>
                <Numeral
                  value={stakeAmount ?? '0'}
                  decimals={18}
                  suffix={colony.nativeToken.symbol}
                />
              </div>
            </div>

            {!hasEnoughTokens && (
              <div>
                Oops! You don`t have enough active tokens. To stake this
                expenditure, please activate more tokens.
              </div>
            )}
          </div>
        )}
      </DialogSection>
      <DialogSection>
        <ActionButton
          actionType={ActionTypes.STAKED_EXPENDITURE_CREATE}
          disabled={!stakeAmount || isLoading || !hasEnoughTokens}
          values={{
            ...formValues,
            stakeAmount: stakeAmount ?? '0',
            stakedExpenditureAddress: stakedExpenditureAddress ?? '',
          }}
          transform={getCreateExpenditureTransformPayloadFn(colony, navigate)}
        >
          Confirm stake
        </ActionButton>
      </DialogSection>
    </Dialog>
  );
};

export default StakeExpenditureDialog;
