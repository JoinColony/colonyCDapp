import React, { useState } from 'react';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';

import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
import { extensionSetupComponentScheme } from '~frame/Extensions/pages/ExtensionSetupPage/consts.ts';
import ExtensionSetupPage from '~frame/Extensions/pages/ExtensionSetupPage/ExtensionSetupPage.tsx';
import { ActionTypes } from '~redux';
import { COLONY_EXTENSION_SETUP_ROUTE, NotFoundRoute } from '~routes';
import { ActionForm } from '~shared/Fields/index.ts';
import { mapPayload, mergePayload, pipe } from '~utils/actions.ts';

import { useExtensionPageContext } from '../../context/ExtensionPageContext.ts';
import {
  createExtensionSetupInitialValues,
  getExtensionDataParams,
  getFormSuccessFn,
  mapExtensionActionPayload,
} from '../../utils.tsx';
import { getValidationSchema } from '../../validation.ts';
import ExtensionDetailsWidget from '../ExtensionDetailsWidget/index.ts';
import ExtensionTabs from '../ExtensionTabs/index.ts';
import ExtensionsTopRow from '../ExtensionTopRow/ExtensionTopRow.tsx';

import { type ExtensionPageFormProps } from './types.ts';

const displayName =
  'frame.Extensions.pages.ExtensionPage.partials.ExtensionPageForm';

const ExtensionPageForm: React.FC<ExtensionPageFormProps> = ({
  extensionData,
  refetchExtensionData,
}) => {
  const { pathname } = useLocation();
  const {
    colony: { colonyAddress, name: colonyName },
    refetchColony,
  } = useColonyContext();
  const navigate = useNavigate();

  const [waitingForEnableConfirmation, setWaitingForEnableConfirmation] =
    useState(false);

  const { initializationParams = [] } = extensionData;
  const isSetupRoute = pathname.split('/').pop() === 'setup';
  const initialValues = createExtensionSetupInitialValues(initializationParams);

  const { setActiveTab } = useExtensionPageContext();

  const transform = pipe(
    mapPayload(({ params }) =>
      mapExtensionActionPayload(params, initializationParams),
    ),
    mergePayload({ colonyAddress, extensionData }),
  );

  const schema = getValidationSchema({ initializationParams });

  const defaultValues = {
    type: extensionData.extensionId,
    option: '',
    params: getExtensionDataParams(extensionData) ?? initialValues,
  };

  const handleFormSuccess = getFormSuccessFn<typeof defaultValues>({
    colonyName,
    extensionData,
    navigate,
    refetchColony,
    refetchExtensionData,
    setWaitingForEnableConfirmation,
    setActiveTab,
  });

  const isSetupComponentAvailable =
    extensionData.extensionId in extensionSetupComponentScheme;

  return (
    <ActionForm<typeof defaultValues>
      actionType={ActionTypes.EXTENSION_ENABLE}
      transform={transform}
      validationSchema={schema}
      defaultValues={defaultValues}
      onSuccess={handleFormSuccess}
    >
      <div className="grid grid-cols-6 gap-4 pb-6 md:gap-x-12 md:gap-y-6">
        <div className="order-1 col-span-6">
          <ExtensionsTopRow
            extensionData={extensionData}
            isSetupRoute={isSetupRoute}
            waitingForEnableConfirmation={waitingForEnableConfirmation}
          />
        </div>
        <div className="order-3 col-span-6 hidden md:order-4 md:col-span-2 md:block lg:order-2 lg:row-span-2">
          <ExtensionDetailsWidget extensionData={extensionData} />
        </div>
        <div className="order-2 col-span-6 md:order-3 md:col-span-4 lg:order-1">
          <Routes>
            <Route
              path="/"
              element={<ExtensionTabs extensionData={extensionData} />}
            />
            {isSetupComponentAvailable && (
              <Route
                path={COLONY_EXTENSION_SETUP_ROUTE}
                element={<ExtensionSetupPage extensionData={extensionData} />}
              />
            )}
            <Route path="*" element={<NotFoundRoute />} />
          </Routes>
        </div>
      </div>
    </ActionForm>
  );
};

ExtensionPageForm.displayName = displayName;

export default ExtensionPageForm;
