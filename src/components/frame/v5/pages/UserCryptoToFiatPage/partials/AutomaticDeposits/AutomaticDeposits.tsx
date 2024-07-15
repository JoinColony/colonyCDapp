import clsx from 'clsx';
import React, { type FC, useState } from 'react';
import { toast } from 'react-toastify';

import { useAppContext } from '~context/AppContext/AppContext.ts';
import { useUpdateUserProfileMutation } from '~gql';
import Toast from '~shared/Extensions/Toast/Toast.tsx';
import Switch from '~v5/common/Fields/Switch/Switch.tsx';
import PillsBase from '~v5/common/Pills/PillsBase.tsx';

import { type CryptoToFiatPageComponentProps } from '../../types.ts';
import RowItem from '../RowItem/index.ts';

import { BODY_MSG, getStatusPillScheme, HEADING_MSG } from './consts.ts';

const displayName = 'v5.pages.UserCryptoToFiatPage.partials.AutomaticDeposits';

const AutomaticDeposits: FC<CryptoToFiatPageComponentProps> = ({
  order,
  kycStatusData,
}) => {
  const { user, updateUser } = useAppContext();

  const [editUser, { loading: editUserLoading }] =
    useUpdateUserProfileMutation();

  const [isAutoOfframEnabled, setIsAutoOfframEnabled] = useState(
    !!user?.profile?.isAutoOfframpEnabled,
  );

  const statusPillScheme = getStatusPillScheme({
    kycStatusData,
    isAutoOfframEnabled,
    bankAccountData: kycStatusData?.bankAccount,
  });

  return (
    <RowItem.Container>
      <RowItem.Heading
        title={HEADING_MSG.headingTitle}
        accessory={HEADING_MSG.headingAccessory}
        itemOrder={order}
        statusPill={
          // Move this inside the RowItem.Heading component
          <PillsBase
            className={clsx(
              statusPillScheme.bgClassName,
              'text-sm font-medium',
            )}
            isCapitalized={false}
          >
            <span className={statusPillScheme.textClassName}>
              {statusPillScheme.copy}
            </span>
          </PillsBase>
        }
      />
      <RowItem.Body
        title={BODY_MSG.bodyTitle}
        description={BODY_MSG.bodyDescription}
        ctaComponent={
          <Switch
            checked={isAutoOfframEnabled}
            onChange={async () => {
              const newValue = !isAutoOfframEnabled;

              setIsAutoOfframEnabled(newValue);

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
