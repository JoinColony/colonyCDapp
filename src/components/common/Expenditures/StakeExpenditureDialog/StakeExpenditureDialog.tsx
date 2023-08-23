import React from 'react';
import { Extension } from '@colony/colony-js';
import { BigNumber } from 'ethers';

import Dialog, { DialogSection } from '~shared/Dialog';
import { Colony } from '~types';
import { useGetUserReputationQuery } from '~gql';
import { ADDRESS_ZERO } from '~constants';
import { SpinnerLoader } from '~shared/Preloaders';
import {
  useAppContext,
  useEnoughTokensForStaking,
  useExtensionData,
} from '~hooks';
import { isInstalledExtensionData } from '~utils/extensions';
import { Heading3 } from '~shared/Heading';
import Numeral from '~shared/Numeral';
import Button from '~shared/Button';

import styles from './StakeExpenditureDialog.module.css';

const useRequiredStakeAmount = (colony: Colony, selectedDomainId: number) => {
  const { data } = useGetUserReputationQuery({
    fetchPolicy: 'network-only',
    variables: {
      input: {
        colonyAddress: colony.colonyAddress,
        walletAddress: ADDRESS_ZERO,
        domainId: selectedDomainId,
      },
    },
  });

  const { extensionData } = useExtensionData(Extension.StakedExpenditure);

  if (
    !extensionData ||
    !isInstalledExtensionData(extensionData) ||
    !extensionData.isEnabled
  ) {
    return null;
  }

  const totalDomainReputation = data?.getUserReputation;
  const { stakeFraction } = extensionData.params?.stakedExpenditure || {};

  if (!totalDomainReputation || !stakeFraction) {
    return null;
  }

  const requiredStakeAmount = BigNumber.from(stakeFraction)
    .mul(totalDomainReputation)
    .div(BigNumber.from(10).pow(18));

  return requiredStakeAmount.toString();
};

interface StakeExpenditureDialogProps {
  colony: Colony;
  selectedDomainId: number;
  onCancel: () => void;
  onConfirm: (stakeAmount: string) => void;
}

const StakeExpenditureDialog = ({
  colony,
  selectedDomainId,
  onCancel,
  onConfirm,
}: StakeExpenditureDialogProps) => {
  const { user } = useAppContext();

  const stakeAmount = useRequiredStakeAmount(colony, selectedDomainId);

  const { loadingUserTokenBalance, hasEnoughTokens } =
    useEnoughTokensForStaking(
      colony.nativeToken.tokenAddress,
      user?.walletAddress ?? '',
      colony.colonyAddress,
      stakeAmount ?? '0',
    );

  return (
    <Dialog cancel={onCancel}>
      <DialogSection>
        <Heading3 appearance={{ margin: 'none' }}>
          Stake to create the payment
        </Heading3>
      </DialogSection>
      <DialogSection>
        {!stakeAmount || loadingUserTokenBalance ? (
          <div className={styles.loader}>
            <SpinnerLoader appearance={{ size: 'large' }} />
          </div>
        ) : (
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
        <Button
          onClick={() => onConfirm(stakeAmount ?? '0')}
          disabled={!stakeAmount || loadingUserTokenBalance || !hasEnoughTokens}
        >
          Confirm stake
        </Button>
      </DialogSection>
    </Dialog>
  );
};

export default StakeExpenditureDialog;
