import { ColonyRole, Id } from '@colony/colony-js';
import React from 'react';

import { ExpenditureStatus, ExpenditureType } from '~gql';
import { useAppContext, useEnabledExtensions } from '~hooks';
import { ActionTypes } from '~redux';
import { ExpenditureFundMotionPayload } from '~redux/types/actions/motion';
import { ActionButton } from '~shared/Button';
import { Colony, Expenditure } from '~types';
import { addressHasRoles } from '~utils/checks';
import { findDomainByNativeId } from '~utils/domains';
import { isExpenditureFunded } from '~utils/expenditures';

import ExpenditureClaimButton from '../ExpenditureClaimButton';

interface ExpenditureAdvanceButtonProps {
  expenditure: Expenditure;
  colony: Colony;
  hasMotionFailed?: boolean;
  isMotionInProgress: boolean;
  latestExpenditureFundingMotionHash?: string;
}

const ExpenditureAdvanceButton = ({
  hasMotionFailed,
  isMotionInProgress,
  latestExpenditureFundingMotionHash,
  expenditure,
  colony,
}: ExpenditureAdvanceButtonProps) => {
  const { user } = useAppContext();
  const { walletAddress = '' } = user ?? {};
  const { isVotingReputationEnabled } = useEnabledExtensions();

  if (expenditure.status === ExpenditureStatus.Draft) {
    return (
      <ActionButton
        actionType={ActionTypes.EXPENDITURE_LOCK}
        values={{
          colonyAddress: colony.colonyAddress,
          nativeExpenditureId: expenditure.nativeId,
        }}
      >
        Lock expenditure
      </ActionButton>
    );
  }

  const userHasFundingPermission = addressHasRoles({
    address: walletAddress,
    colony,
    requiredRoles: [ColonyRole.Funding],
    requiredRolesDomains: [Id.RootDomain],
  });

  if (
    expenditure.status === ExpenditureStatus.Locked &&
    !isExpenditureFunded(expenditure)
  ) {
    return (
      <>
        {userHasFundingPermission && (
          <ActionButton
            actionType={ActionTypes.EXPENDITURE_FUND}
            disabled={isMotionInProgress}
            values={{
              colonyAddress: colony.colonyAddress,
              fromDomainFundingPotId:
                findDomainByNativeId(
                  expenditure.metadata?.fundFromDomainNativeId ?? Id.RootDomain,
                  colony,
                )?.nativeFundingPotId ?? Id.RootPot,
              expenditure,
            }}
          >
            Fund expenditure
          </ActionButton>
        )}
        {isVotingReputationEnabled ? (
          ((latestExpenditureFundingMotionHash && hasMotionFailed) ||
            !latestExpenditureFundingMotionHash) && (
            <ActionButton<ExpenditureFundMotionPayload>
              actionType={ActionTypes.MOTION_EXPENDITURE_FUND}
              values={{
                colony,
                fromDomainId:
                  expenditure.metadata?.fundFromDomainNativeId ?? Id.RootDomain,
                fromDomainFundingPotId:
                  findDomainByNativeId(
                    expenditure.metadata?.fundFromDomainNativeId ??
                      Id.RootDomain,
                    colony,
                  )?.nativeFundingPotId ?? Id.RootPot,
                expenditure,
                motionDomainId: expenditure.nativeDomainId ?? Id.RootDomain,
              }}
            >
              Fund expenditure motion
            </ActionButton>
          )
        ) : (
          <span>
            Install the governance extension to enable the expenditure funding
            motion
          </span>
        )}
      </>
    );
  }

  if (
    expenditure.status === ExpenditureStatus.Locked &&
    isExpenditureFunded(expenditure)
  ) {
    return (
      <ActionButton
        actionType={ActionTypes.EXPENDITURE_FINALIZE}
        values={{
          colonyAddress: colony.colonyAddress,
          nativeExpenditureId: expenditure.nativeId,
        }}
      >
        Finalize expenditure
      </ActionButton>
    );
  }

  if (
    expenditure.type !== ExpenditureType.Staged &&
    expenditure.status === ExpenditureStatus.Finalized
  ) {
    return <ExpenditureClaimButton colony={colony} expenditure={expenditure} />;
  }

  return null;
};

export default ExpenditureAdvanceButton;
