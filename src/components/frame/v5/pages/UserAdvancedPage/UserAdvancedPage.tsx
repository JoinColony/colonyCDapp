import React from 'react';
import { useIntl } from 'react-intl';

import { toast } from 'react-toastify';
import { SlotKey, useCanEditProfile, useUserSettings } from '~hooks';
import Navigation from '~v5/common/Navigation';
import TwoColumns from '~v5/frame/TwoColumns';
import Spinner from '~v5/shared/Spinner';
import SettingsRow from './partials/SettingsRow';
import { useUserAdvancedPage } from './hooks';
import { FormValues } from './types';
import { HookForm } from '~shared/Fields';
import { canUseMetatransactions } from '~utils/checks';
import Toast from '~shared/Extensions/Toast';
import UserProfileSpinner from '~common/UserProfile';

const displayName = 'v5.pages.UserAdvancedPage';

const UserAdvancedPage = () => {
  const { user, loadingProfile } = useCanEditProfile();
  const { formatMessage } = useIntl();
  const { setFormValuesToLocalStorage, validationSchema } =
    useUserAdvancedPage();

  const metatransactionsAvailable = canUseMetatransactions();
  const {
    settings: {
      metatransactions: metatransactionsSetting,
      decentralizedModeEnabled,
      customRpc,
    },
    setSettingsKey,
  } = useUserSettings();
  const metatransasctionsDefault = metatransactionsAvailable
    ? metatransactionsSetting
    : false;

  if (loadingProfile) {
    return <UserProfileSpinner />;
  }

  if (!user) {
    return null;
  }

  const handleSubmit = (values: FormValues) => {
    setFormValuesToLocalStorage(values, setSettingsKey);
  };

  return (
    <Spinner loadingText={{ id: 'loading.userAdvancedPage' }}>
      <TwoColumns aside={<Navigation pageName="profile" />}>
        <HookForm
          onSubmit={handleSubmit}
          validationSchema={validationSchema}
          defaultValues={{
            [SlotKey.Metatransactions]: metatransasctionsDefault,
            [SlotKey.DecentralizedMode]: decentralizedModeEnabled,
            [SlotKey.CustomRPC]: customRpc,
          }}
        >
          <h4 className="heading-4 mb-6">
            {formatMessage({ id: 'userAdvancedPage.title' })}
          </h4>
          <SettingsRow
            title={{ id: 'advancedSettings.fees.title' }}
            description={{ id: 'advancedSettings.fees.description' }}
            tooltipMessage={{ id: 'advancedSettings.fees.tooltip' }}
            id={SlotKey.Metatransactions}
            onChange={(value) => {
              toast.success(
                <Toast
                  type="success"
                  title={{ id: 'advancedSettings.fees.toast.title' }}
                  description={{
                    id: value
                      ? 'advancedSettings.fees.toast.description.true'
                      : 'advancedSettings.fees.toast.description.false',
                  }}
                />,
              );
            }}
          />
          <SettingsRow
            title={{ id: 'advancedSettings.rpc.title' }}
            description={{ id: 'advancedSettings.rpc.description' }}
            subtitle={{ id: 'advancedSettings.rpc.subtitle' }}
            tooltipMessage={{ id: 'advancedSettings.rpc.tooltip' }}
            id={SlotKey.CustomRPC}
            onChange={() => {}}
          />
          <SettingsRow
            title={{ id: 'advancedSettings.account.title' }}
            description={{ id: 'advancedSettings.account.description' }}
            // @TODO: Add functionality to download user data
            onClick={() => {}}
            buttonLabel={{ id: 'advancedSettings.account.button' }}
            buttonIcon="file-arrow-down"
            buttonMode="primaryOutline"
          />
          <SettingsRow
            title={{ id: 'advancedSettings.delete.title' }}
            description={{ id: 'advancedSettings.delete.description' }}
            onClick={() => {}}
            buttonLabel={{ id: 'advancedSettings.delete.button' }}
            buttonIcon="trash"
            buttonMode="secondaryOutline"
          />
        </HookForm>
      </TwoColumns>
    </Spinner>
  );
};

UserAdvancedPage.displayName = displayName;

export default UserAdvancedPage;
