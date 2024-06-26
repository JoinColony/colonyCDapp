import clsx from 'clsx';
import React, { useState } from 'react';
import { defineMessages } from 'react-intl';
import { toast } from 'react-toastify';

import { useAppContext } from '~context/AppContext/AppContext.ts';
import { useUpdateUserProfileMutation } from '~gql';
import Toast from '~shared/Extensions/Toast/Toast.tsx';
import Switch from '~v5/common/Fields/Switch/Switch.tsx';
import PillsBase from '~v5/common/Pills/PillsBase.tsx';

import RowItem from '../RowItem/index.ts';

import { statusPillScheme } from './consts.ts';

const displayName = 'v5.pages.UserCryptoToFiatPage.partials.AutomaticDeposits';

const MSG = defineMessages({
  headingTitle: {
    id: `${displayName}.headingTitle`,
    defaultMessage: 'Bank details',
  },
  headingAccessory: {
    id: `${displayName}.headingAccessory`,
    defaultMessage: 'Required',
  },
  bodyTitle: {
    id: `${displayName}.bodyTitle`,
    defaultMessage: 'Automatically deposit USDC payments to your bank account',
  },
  bodyDescription: {
    id: `${displayName}.bodyDescription`,
    defaultMessage:
      'Enable this to automatically USD or EUR in your account any time you receive a USDC payment from the colony app. A gateway fee, plus any transaction costs will be deducted from your payment',
  },
  bodyCtaTitle: {
    id: `${displayName}.bodyCtaTitle`,
    defaultMessage: 'Start KYC',
  },
});

const AutomaticDeposits = () => {
  const status = 'kycPaymentRequired';

  const { user, updateUser } = useAppContext();

  const [editUser, { loading: editUserLoading }] =
    useUpdateUserProfileMutation();

  const [isChecked, setIsChecked] = useState(
    !!user?.profile?.isAutoOfframpEnabled,
  );

  return (
    <RowItem.Container>
      <RowItem.Heading
        title={MSG.headingTitle}
        accessory={MSG.headingAccessory}
        itemOrder={3}
        statusPill={
          // Move this inside the RowItem.Heading component
          <PillsBase
            className={clsx(
              statusPillScheme[status].bgClassName,
              'text-sm font-medium',
            )}
          >
            <span className={statusPillScheme[status].textClassName}>
              {status}
            </span>
          </PillsBase>
        }
      />
      <RowItem.Body
        title={MSG.bodyTitle}
        description={MSG.bodyDescription}
        ctaComponent={
          <Switch
            checked={isChecked}
            onChange={async () => {
              const newValue = !isChecked;

              setIsChecked(newValue);

              await editUser({
                variables: {
                  input: {
                    id: user?.walletAddress ?? '',
                    isAutoOfframpEnabled: newValue,
                  },
                },
              });

              updateUser(user?.walletAddress ?? '', true);

              toast.success(
                <Toast
                  type="success"
                  title={{ id: 'advancedSettings.toast.changesSaved' }}
                  description={{
                    id: 'advancedSettings.toast.autoOfframp.success',
                  }}
                />,
              );
            }}
            disabled={editUserLoading}
          />
        }
      />
    </RowItem.Container>
  );
};

AutomaticDeposits.displayName = displayName;

export default AutomaticDeposits;
