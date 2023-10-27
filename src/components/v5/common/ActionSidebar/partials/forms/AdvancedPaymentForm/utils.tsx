import React from 'react';
import { DeepPartial } from 'utility-types';
import { DescriptionMetadataGetter } from '~v5/common/ActionSidebar/types';
import UserPopover from '~v5/shared/UserPopover';
import { AdvancedPaymentFormValues } from './consts';

const getRecipientsText = (paymentsCount: number): string => {
  switch (paymentsCount) {
    case 0:
      return 'multiple recipients';
    case 1:
      return '1 recipient';
    default:
      return `${paymentsCount} recipients`;
  }
};

const getTokensText = (
  payments: DeepPartial<AdvancedPaymentFormValues>['payments'],
): string => {
  if (!payments) {
    return 'with multiple tokens';
  }

  const tokensCount = new Set(
    payments.map((payment) => payment?.amount?.tokenAddress).filter(Boolean),
  ).size;

  switch (tokensCount) {
    case 0:
      return 'multiple tokens';
    case 1:
      return '1 token';
    default:
      return `${tokensCount} tokens`;
  }
};

export const advancedPaymentDescriptionMetadataGetter: DescriptionMetadataGetter<
  DeepPartial<AdvancedPaymentFormValues>
> = async ({ payments }, { currentUser }) => (
  <>
    Payment to {getRecipientsText(payments?.length || 0)} with{' '}
    {getTokensText(payments)}
    {currentUser?.profile?.displayName && (
      <>
        {' '}
        by{' '}
        <UserPopover
          userName={currentUser?.profile?.displayName}
          walletAddress={currentUser.walletAddress}
          aboutDescription={currentUser.profile?.bio || ''}
          user={currentUser}
        >
          <span className="text-blue-400 font-medium">
            {currentUser.profile.displayName}
          </span>
        </UserPopover>
      </>
    )}
  </>
);
