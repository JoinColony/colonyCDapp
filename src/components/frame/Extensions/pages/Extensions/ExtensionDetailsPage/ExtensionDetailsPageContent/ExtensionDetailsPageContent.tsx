import React, { type FC } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';

import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
import { useSetPageHeadingTitle } from '~context/PageHeadingContext/PageHeadingContext.ts';
import { ActionTypes } from '~redux/index.ts';
import { COLONY_EXTENSION_SETUP_ROUTE } from '~routes/index.ts';
import NotFoundRoute from '~routes/NotFoundRoute.tsx';
import { ActionForm } from '~shared/Fields/index.ts';
import { mapPayload, mergePayload, pipe } from '~utils/actions.ts';
import { formatText } from '~utils/intl.ts';

import { useExtensionDetailsPageContext } from '../context/ExtensionDetailsPageContext.ts';
import ExtensionDetails from '../partials/ExtensionDetails/ExtensionDetails.tsx';
import ExtensionInfo from '../partials/ExtensionInfo.tsx';
import ExtensionsTopRow from '../partials/ExtensionTopRow.tsx';

import { SetupComponentMap } from './consts.ts';
import { type ExtensionDetailsPageContentProps } from './types.ts';
import {
  createExtensionSetupInitialValues,
  getFormSuccessFn,
  mapExtensionActionPayload,
} from './utils.tsx';
import { getValidationSchema } from './validation.ts';

const displayName = 'frame.Extensions.pages.ExtensionDetailsPageContent';

const ExtensionDetailsPageContent: FC<ExtensionDetailsPageContentProps> = ({
  extensionData,
  refetchExtensionData,
}) => {
  const {
    colony: { colonyAddress, name: colonyName },
    refetchColony,
  } = useColonyContext();
  const navigate = useNavigate();
  const { setWaitingForActionConfirmation, setActiveTab } =
    useExtensionDetailsPageContext();

  useSetPageHeadingTitle(formatText({ id: 'extensionsPage.title' }));

  const { initializationParams = [] } = extensionData;
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
    refetchColony,
    refetchExtensionData,
    setWaitingForActionConfirmation,
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
      <div className="mb-6 w-full">
        <ExtensionsTopRow extensionData={extensionData} />
      </div>
      <div className="grid w-full grid-cols-11 gap-4 pb-6 md:gap-8">
        <div className="col-span-11 md:col-span-8 md:pr-4">
          <Routes>
            <Route
              path="/"
              element={
                <ExtensionInfo
                  extensionData={extensionData}
                  showSetupPage={
                    !!SetupComponent && extensionData.isInitialized
                  }
                />
              }
            />
            {SetupComponent && (
              <Route
                path={COLONY_EXTENSION_SETUP_ROUTE}
                element={
                  <SetupComponent
                    extensionData={extensionData}
                    setActiveTab={setActiveTab}
                  />
                }
              />
            )}
            <Route path="*" element={<NotFoundRoute />} />
          </Routes>
        </div>
        <div className="hidden md:col-span-3 md:block">
          <ExtensionDetails extensionData={extensionData} />
        </div>
      </div>
    </ActionForm>
  );
};

ExtensionDetailsPageContent.displayName = displayName;

export default ExtensionDetailsPageContent;
