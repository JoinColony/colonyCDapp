import React from 'react';

import { useAppContext } from '~hooks';
import { ActionTypes } from '~redux';
import { CreateExpenditurePayload } from '~redux/sagas/expenditures/createExpenditure';
import { ActionButton } from '~shared/Button';
import { ActionButtonProps } from '~shared/Button/ActionButton';
import Dialog, { DialogSection } from '~shared/Dialog';
import { Heading3 } from '~shared/Heading';
import Numeral from '~shared/Numeral';
import { SpinnerLoader } from '~shared/Preloaders';
import { Colony } from '~types';

import { ExpenditureFormValues } from '../../ExpenditureForm';

import useExpenditureStaking from './useExpenditureStaking';

import styles from './StakeExpenditureDialog.module.css';

interface StakeExpenditureDialogProps
  extends Pick<ActionButtonProps<CreateExpenditurePayload>, 'transform'> {
  colony: Colony;
  onCancel: () => void;
  formValues: ExpenditureFormValues;
}

const StakeExpenditureDialog = ({
  colony,
  onCancel,
  formValues,
  transform,
}: StakeExpenditureDialogProps) => {
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
          transform={transform}
        >
          Confirm stake
        </ActionButton>
      </DialogSection>
    </Dialog>
  );
};

export default StakeExpenditureDialog;
