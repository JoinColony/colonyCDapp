import React, { useState } from 'react';
import { toast } from 'react-toastify';

import { LEARN_MORE_CRYPTO_TO_FIAT } from '~constants';
import { useAppContext } from '~context/AppContext/AppContext.ts';
import { useCryptoToFiatContext } from '~frame/v5/pages/UserCryptoToFiatPage/context/CryptoToFiatContext.ts';
import { KycStatus, useUpdateUserProfileMutation } from '~gql';
import Toast from '~shared/Extensions/Toast/Toast.tsx';
import { formatText } from '~utils/intl.ts';
import Switch from '~v5/common/Fields/Switch/Switch.tsx';

import RowItem from '../RowItem/index.ts';

import { BODY_MSG, getBadgeProps, HEADING_MSG } from './consts.ts';

const displayName = 'v5.pages.UserCryptoToFiatPage.partials.AutomaticDeposits';

const BodyDescription = () => (
  <>
    {formatText(BODY_MSG.bodyDescription)}
    {'. '}
    <a
      href={LEARN_MORE_CRYPTO_TO_FIAT}
      className="font-medium text-gray-900 underline transition-colors hover:text-blue-400"
    >
      {formatText({ id: 'navigation.learnMore' })}
    </a>
  </>
);

const AutomaticDeposits = () => {
  const { kycStatusData, isKycStatusDataLoading } = useCryptoToFiatContext();

  const { user, updateUser } = useAppContext();

  const [editUser, { loading: editUserLoading }] =
    useUpdateUserProfileMutation();

  const [isAutoOfframEnabled, setIsAutoOfframEnabled] = useState(
    !!user?.profile?.isAutoOfframpEnabled,
  );

  const badgeProps = getBadgeProps({
    kycStatusData,
    isAutoOfframEnabled,
    bankAccountData: kycStatusData?.bankAccount ?? null,
  });

  return (
    <RowItem.Container>
      <RowItem.Heading
        title={formatText(HEADING_MSG.headingTitle)}
        accessory={formatText(HEADING_MSG.headingAccessory)}
        itemIndex={3}
        badgeProps={badgeProps}
        isDataLoading={isKycStatusDataLoading}
      />
      <RowItem.Body
        title={formatText(BODY_MSG.bodyTitle)}
        description={<BodyDescription />}
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
            disabled={
              editUserLoading ||
              kycStatusData?.kycStatus !== KycStatus.Approved ||
              !kycStatusData?.bankAccount
            }
          />
        }
      />
    </RowItem.Container>
  );
};

AutomaticDeposits.displayName = displayName;

export default AutomaticDeposits;
