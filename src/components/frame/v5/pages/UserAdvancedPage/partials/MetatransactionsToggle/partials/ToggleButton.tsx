import React, { useState } from 'react';
import { toast } from 'react-toastify';

import { useAppContext } from '~context/AppContext/AppContext.ts';
import { useUpdateUserProfileMutation } from '~gql';
import Toast from '~shared/Extensions/Toast/index.ts';
import { canUseMetatransactions } from '~utils/checks/index.ts';
import Switch from '~v5/common/Fields/Switch/index.ts';

const displayName =
  'v5.pages.UserAdvancedPage.partials.MetaTransactionsToggle.partials.ToggleButton';

const ToggleButton = () => {
  const { user, updateUser } = useAppContext();
  const [areMetaTxEnabled, setAreMetaTxEnabled] = useState<boolean>(() => {
    const userProfileMeta = user?.profile?.meta;
    const metatransactionsAvailable = canUseMetatransactions();

    return metatransactionsAvailable
      ? userProfileMeta?.metatransactionsEnabled ?? false
      : false;
  });

  const [editUser, { loading }] = useUpdateUserProfileMutation();

  const handleUpdateMetaTxStatus = async (enabled: boolean): Promise<void> => {
    await editUser({
      variables: {
        input: {
          id: user?.walletAddress ?? '',
          meta: {
            metatransactionsEnabled: enabled,
          },
        },
      },
    });
    await updateUser(user?.walletAddress, true);
    setAreMetaTxEnabled(enabled);

    toast.success(
      <Toast
        type="success"
        title={{ id: 'advancedSettings.toast.changesSaved' }}
        description={{
          id: enabled
            ? 'advancedSettings.fees.toast.description.true'
            : 'advancedSettings.fees.toast.description.false',
        }}
      />,
    );
  };

  return (
    <Switch
      checked={areMetaTxEnabled}
      disabled={loading}
      onChange={async () => {
        await handleUpdateMetaTxStatus(!areMetaTxEnabled);
      }}
    />
  );
};

ToggleButton.displayName = displayName;
export default ToggleButton;
