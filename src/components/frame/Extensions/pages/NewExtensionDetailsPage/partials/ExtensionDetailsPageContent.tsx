import React, { /* useMemo, */ type FC } from 'react';
// import { Route, Routes, useNavigate } from 'react-router-dom';

// import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
// import { SetupComponentMap } from '~frame/Extensions/pages/ExtensionDetailsPage/consts.ts';
// import ExtensionDetails from '~frame/Extensions/pages/ExtensionDetailsPage/partials/ExtensionDetails/ExtensionDetails.tsx';
import { type ExtensionDetailsPageContentProps } from '~frame/Extensions/pages/ExtensionDetailsPage/types.ts';
import {
  getActionData,
  // getExtensionParams,
  // getFormSuccessFn,
  // mapExtensionActionPayload,
} from '~frame/Extensions/pages/ExtensionDetailsPage/utils.tsx';
// import { getValidationSchema } from '~frame/Extensions/pages/ExtensionDetailsPage/validation.ts';
// import { COLONY_EXTENSION_SETUP_ROUTE, NotFoundRoute } from '~routes';
import { ActionForm } from '~shared/Fields/index.ts';
// import { mapPayload, mergePayload, pipe } from '~utils/actions.ts';

// import { useExtensionDetailsPageContext } from '../context/ExtensionDetailsPageContext.ts';

import ExtensionDetails from './ExtensionDetails/ExtensionDetails.tsx';
import ExtensionsTopRow from './ExtensionDetailsHeader/ExtensionDetailsHeader.tsx';
import ExtensionTabs from './ExtensionTabs/ExtensionTabs.tsx';

const ExtensionDetailsPageContent: FC<ExtensionDetailsPageContentProps> = ({
  extensionData,
  // refetchExtensionData,
}) => {
  // const { setActiveTab, setWaitingForActionConfirmation } =
  //   useExtensionDetailsPageContext();

  return (
    // eslint-disable-next-line react/jsx-no-useless-fragment
    <ActionForm /* <typeof defaultValues> */
      actionType={getActionData(extensionData)}
      // transform={transform}
      // validationSchema={schema}
      // defaultValues={defaultValues}
      // onSuccess={handleFormSuccess}
    >
      <div className="mb-6 w-full">
        <ExtensionsTopRow extensionData={extensionData} />
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
    </ActionForm>
  );
};

export default ExtensionDetailsPageContent;
