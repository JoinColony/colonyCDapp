import React, { type FC, useState } from 'react';
import {
  Route,
  Routes,
  useLocation,
  useNavigate,
  useParams,
} from 'react-router-dom';

import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
import { ExtensionSaveSettingsContextProvider } from '~context/ExtensionSaveSettingsContext/ExtensionSaveSettingsContextProvider.tsx';
import { useSetPageHeadingTitle } from '~context/PageHeadingContext/PageHeadingContext.ts';
import useExtensionData from '~hooks/useExtensionData.ts';
import { ActionTypes } from '~redux/index.ts';
import { COLONY_EXTENSION_SETUP_ROUTE } from '~routes/index.ts';
import NotFoundRoute from '~routes/NotFoundRoute.tsx';
import { ActionForm } from '~shared/Fields/index.ts';
import { mapPayload, mergePayload, pipe } from '~utils/actions.ts';
import { formatText } from '~utils/intl.ts';

import { SetupComponentMap } from './consts.ts';
import ExtensionInfo from './ExtensionInfo.tsx';
import ExtensionsTopRow from './ExtensionTopRow.tsx';
import { useCheckExtensionEnabled } from './hooks.ts';
import ExtensionDetails from './partials/ExtensionDetails/index.ts';
import {
  createExtensionSetupInitialValues,
  getFormSuccessFn,
  mapExtensionActionPayload,
} from './utils.tsx';
import { getValidationSchema } from './validation.ts';

const displayName = 'frame.Extensions.pages.ExtensionDetailsPage';

const ExtensionDetailsPage: FC = () => {
  // @TODO replace this with a proper use of context
  const [activeTab, setActiveTab] = useState(0);
  const { extensionId } = useParams();
  const { pathname } = useLocation();
  const {
    colony: { colonyAddress, name: colonyName },
  } = useColonyContext();
  const navigate = useNavigate();
  const { extensionData, loading } = useExtensionData(extensionId ?? '');
  const { checkExtensionEnabled } = useCheckExtensionEnabled(extensionId ?? '');
  const [waitingForEnableConfirmation, setWaitingForEnableConfirmation] =
    useState(false);

  useSetPageHeadingTitle(formatText({ id: 'extensionsPage.title' }));

  if (!extensionData && !loading) {
    return <NotFoundRoute />;
  }

  if (!extensionData) {
    return (
      <p>{formatText({ id: 'extensionDetailsPage.unsupportedExtension' })}</p>
    );
  }

  const { initializationParams = [] } = extensionData;
  const isSetupRoute = pathname.split('/').pop() === 'setup';
  const initialValues = createExtensionSetupInitialValues(initializationParams);

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
    params: initialValues,
  };

  const handleFormSuccess = getFormSuccessFn<typeof defaultValues>({
    colonyName,
    extensionData,
    navigate,
    checkExtensionEnabled,
    setWaitingForEnableConfirmation,
  });

  const SetupComponent = SetupComponentMap[extensionData.extensionId];

  return (
    <ActionForm<typeof defaultValues>
      actionType={ActionTypes.EXTENSION_ENABLE}
      transform={transform}
      validationSchema={schema}
      defaultValues={defaultValues}
      onSuccess={handleFormSuccess}
    >
      <ExtensionSaveSettingsContextProvider>
        <div className="grid grid-cols-6 gap-4 pb-6 md:gap-x-12 md:gap-y-6">
          <div className="order-1 col-span-6">
            <ExtensionsTopRow
              extensionData={extensionData}
              isSetupRoute={isSetupRoute}
              waitingForEnableConfirmation={waitingForEnableConfirmation}
              onActiveTabChange={setActiveTab}
            />
          </div>
          <div className="order-3 hidden md:col-span-2 md:block lg:row-span-2">
            <ExtensionDetails extensionData={extensionData} />
          </div>
          <div className="order-2 col-span-6 md:order-2 md:col-span-4 lg:order-2">
            <Routes>
              <Route
                path="/"
                element={
                  <ExtensionInfo
                    activeTab={activeTab}
                    onActiveTabChange={setActiveTab}
                    extensionData={extensionData}
                  />
                }
              />
              {SetupComponent && (
                <Route
                  path={COLONY_EXTENSION_SETUP_ROUTE}
                  element={<SetupComponent extensionData={extensionData} />}
                />
              )}
              <Route path="*" element={<NotFoundRoute />} />
            </Routes>
          </div>
        </div>
      </ExtensionSaveSettingsContextProvider>
    </ActionForm>
  );
};

ExtensionDetailsPage.displayName = displayName;

export default ExtensionDetailsPage;
