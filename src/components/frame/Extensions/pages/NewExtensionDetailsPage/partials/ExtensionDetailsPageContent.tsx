import React, { type FC } from 'react';

import { useExtensionDetailsPageContext } from '../context/ExtensionDetailsPageContext.ts';

import ExtensionDetails from './ExtensionDetails/ExtensionDetails.tsx';
import ExtensionDetailsHeader from './ExtensionDetailsHeader/ExtensionDetailsHeader.tsx';
import ExtensionSettingsForm from './ExtensionSettings/ExtensionSettingsForm.tsx';
import ExtensionTabs from './ExtensionTabs/ExtensionTabs.tsx';

const ExtensionDetailsPageContent: FC = () => {
  // const { setActiveTab, setWaitingForActionConfirmation } =
  //   useExtensionDetailsPageContext();
  const { extensionData } = useExtensionDetailsPageContext();

  return (
    <ExtensionSettingsForm>
      <div className="mb-6 w-full">
        <ExtensionDetailsHeader />
      </div>
      <div className="grid w-full grid-cols-11 gap-4 pb-6 md:gap-8">
        <div className="col-span-11 md:col-span-8 md:pr-4">
          <ExtensionTabs
            extensionData={extensionData}
            // showSetupPage={!!SetupComponent && extensionData.isInitialized}
          />
        </div>
        <div className="hidden md:col-span-3 md:block">
          <ExtensionDetails extensionData={extensionData} />
        </div>
      </div>
    </ExtensionSettingsForm>
  );
};

export default ExtensionDetailsPageContent;
