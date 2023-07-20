import React, { FC } from 'react';

import Navigation from '~v5/common/Navigation';
import TwoColumns from '~v5/frame/TwoColumns';
import Spinner from '~v5/shared/Spinner';
import SettingsRow from '~v5/common/SettingsRow';
import FeesForm from '../FeesForm';
import RpcForm from '../RpcForm/RpcForm';

const displayName = 'v5.pages.UserAdvancedPage.partials.UserAdvancedSettings';

const UserAdvancedSettings: FC = () => (
  <Spinner loadingText={{ id: 'loading.userAdvancedPage' }}>
    <TwoColumns aside={<Navigation pageName="profile" />}>
      <FeesForm />
      <RpcForm />
      <div className="border-b border-gray-200">
        <SettingsRow
          title={{ id: 'advancedSettings.account.title' }}
          description={{ id: 'advancedSettings.account.description' }}
          // @TODO: Add functionality to download user data
          onClick={() => {}}
          buttonLabel={{ id: 'button.download' }}
          buttonIcon="file-arrow-down"
          buttonMode="primaryOutline"
        />
      </div>
      <SettingsRow
        title={{ id: 'advancedSettings.delete.title' }}
        description={{ id: 'advancedSettings.delete.description' }}
        // @TODO: Add functionality to delete account
        onClick={() => {}}
        buttonLabel={{ id: 'button.deleteAccount' }}
        buttonIcon="trash"
        buttonMode="secondaryOutline"
      />
    </TwoColumns>
  </Spinner>
);

UserAdvancedSettings.displayName = displayName;

export default UserAdvancedSettings;
