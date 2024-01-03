import { ColonyRole, Id } from '@colony/colony-js';
import React, { useState } from 'react';

import { ExpenditureStatus } from '~gql';
import { useAppContext, useEnabledExtensions } from '~hooks';
import Button from '~shared/Button';
import { Colony, Expenditure } from '~types';
import { addressHasRoles } from '~utils/checks';

import CancelStakedExpenditureDialog from './CancelStakedExpenditureDialog';

interface CancelStakedExpenditureButtonProps {
  colony: Colony;
  expenditure: Expenditure;
  hasMotionFailed?: boolean;
  isMotionInProgress: boolean;
  latestExpenditureCancelMotionHash?: string;
}

const CancelStakedExpenditureButton = ({
  colony,
  expenditure,
  hasMotionFailed,
  isMotionInProgress,
  latestExpenditureCancelMotionHash,
}: CancelStakedExpenditureButtonProps) => {
  const { user } = useAppContext();
  const { walletAddress = '' } = user ?? {};
  const { isVotingReputationEnabled } = useEnabledExtensions();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isMotion, setIsMotion] = useState(false);

  if (
    !expenditure.isStaked ||
    expenditure.status !== ExpenditureStatus.Locked
  ) {
    return null;
  }

  const userHasArbitrationPermission = addressHasRoles({
    address: walletAddress,
    colony,
    requiredRoles: [ColonyRole.Arbitration],
    requiredRolesDomains: [Id.RootDomain],
  });

  return (
    <>
      {userHasArbitrationPermission && (
        <Button
          disabled={isMotionInProgress}
          onClick={() => setIsDialogOpen(true)}
        >
          Cancel expenditure (as non-owner)
        </Button>
      )}

      {isVotingReputationEnabled ? (
        ((latestExpenditureCancelMotionHash && hasMotionFailed) ||
          !latestExpenditureCancelMotionHash) && (
          <Button
            onClick={() => {
              setIsMotion(true);
              setIsDialogOpen(true);
            }}
          >
            Cancel expenditure motion (as non-owner)
          </Button>
        )
      ) : (
        <span>
          Install the governance extension to enable the expenditure cancel
          motion
        </span>
      )}
      {isDialogOpen && (
        <CancelStakedExpenditureDialog
          colony={colony}
          isMotion={isMotion}
          expenditure={expenditure}
          cancel={() => {
            setIsMotion(false);
            setIsDialogOpen(false);
          }}
        />
      )}
    </>
  );
};

export default CancelStakedExpenditureButton;
