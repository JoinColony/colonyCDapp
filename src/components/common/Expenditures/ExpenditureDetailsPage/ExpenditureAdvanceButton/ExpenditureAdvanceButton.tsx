import React from 'react';
import { ColonyRole, Id } from '@colony/colony-js';

import { ExpenditureStatus } from '~gql';
import { ActionTypes } from '~redux';
import { ActionButton } from '~shared/Button';
import { Colony, Expenditure } from '~types';
import { isExpenditureFunded } from '~utils/expenditures';
import { findDomainByNativeId } from '~utils/domains';

import ExpenditureClaimButton from '../ExpenditureClaimButton';
import { addressHasRoles } from '~utils/checks';
import { useAppContext, useEnabledExtensions } from '~hooks';
import { ExpenditureFundMotionPayload } from '~redux/types/actions/motion';
import Link from '~shared/Link/Link';

interface ExpenditureAdvanceButtonProps {
  expenditure: Expenditure;
  colony: Colony;
}

const ExpenditureAdvanceButton = ({
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
        {/* eslint-disable-next-line no-nested-ternary */}
        {isVotingReputationEnabled ? (
          expenditure.fundingMotion ? (
            <Link
              to={`/colony/${colony.name}/tx/${expenditure.fundingMotion.transactionHash}`}
            >
              Click for Motion
            </Link>
          ) : (
            <ActionButton<ExpenditureFundMotionPayload>
              actionType={ActionTypes.MOTION_EXPENDITURE_FUND}
              values={{
                colonyAddress: colony.colonyAddress,
                fromDomainId: expenditure.nativeDomainId ?? Id.RootDomain,
                fromDomainFundingPotId:
                  findDomainByNativeId(
                    expenditure.metadata?.fundFromDomainNativeId ??
                      Id.RootDomain,
                    colony,
                  )?.nativeFundingPotId ?? Id.RootPot,
                expenditure,
                motionDomainId: Id.RootDomain,
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

  if (expenditure.status === ExpenditureStatus.Finalized) {
    return <ExpenditureClaimButton colony={colony} expenditure={expenditure} />;
  }

  return null;
};

export default ExpenditureAdvanceButton;
