import React, { useMemo, type FC } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';

import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
import { COLONY_EXTENSION_SETUP_ROUTE, NotFoundRoute } from '~routes';
import { ActionForm } from '~shared/Fields/index.ts';
import { mapPayload, mergePayload, pipe } from '~utils/actions.ts';

import { SetupComponentMap } from '../consts.ts';
import { useExtensionDetailsPageContext } from '../context/ExtensionDetailsPageContext.ts';
import { type ExtensionDetailsPageContentProps } from '../types.ts';
import {
  getActionData,
  getExtensionParams,
  getFormSuccessFn,
  mapExtensionActionPayload,
} from '../utils.tsx';
import { getValidationSchema } from '../validation.ts';

import ExtensionDetails from './ExtensionDetails/ExtensionDetails.tsx';
import ExtensionInfo from './ExtensionInfo.tsx';
import ExtensionsTopRow from './ExtensionTopRow.tsx';

const ExtensionDetailsPageContent: FC<ExtensionDetailsPageContentProps> = ({
  extensionData,
  refetchExtensionData,
}) => {
  const { setActiveTab, setWaitingForActionConfirmation } =
    useExtensionDetailsPageContext();
  const {
    colony: { colonyAddress, name: colonyName },
    refetchColony,
  } = useColonyContext();
  const navigate = useNavigate();

  const defaultValues = useMemo(
    () => ({
      type: extensionData?.extensionId,
      option: '',
      params: getExtensionParams(extensionData),
    }),
    [extensionData],
  );

  const { initializationParams = [] } = extensionData;

  const transform = pipe(
    mapPayload(({ params }) =>
      mapExtensionActionPayload(params, initializationParams),
    ),
    mergePayload({ colonyAddress, extensionData }),
  );

  const schema = getValidationSchema({ initializationParams });

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
      actionType={getActionData(extensionData)}
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

export default ExtensionDetailsPageContent;
