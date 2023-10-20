import React, { FC, useState } from 'react';
import {
  Route,
  Routes,
  useLocation,
  useNavigate,
  useParams,
} from 'react-router-dom';

import { useColonyContext, useExtensionData } from '~hooks';
import ExtensionDetails from './partials/ExtensionDetails';
import ThreeColumns from '~v5/frame/ThreeColumns';
import ImageCarousel from '~common/Extensions/ImageCarousel';

import { COLONY_EXTENSION_SETUP_ROUTE } from '~routes';
import NotFoundRoute from '~routes/NotFoundRoute';
import { ActionForm } from '~shared/Fields';
import { ActionTypes } from '~redux';
import { mapPayload, mergePayload, pipe } from '~utils/actions';
import {
  createExtensionSetupInitialValues,
  mapExtensionActionPayload,
} from '~common/Extensions/ExtensionSetup/utils';
import { formatText } from '~utils/intl';
import { getValidationSchema } from './validation';

import { getFormSuccessFn } from './utils';
import ExtensionInfo from './ExtensionInfo';
import ExtensionsTopRow from './ExtensionTopRow';
import { SetupComponentMap } from './consts';

const displayName = 'frame.Extensions.pages.ExtensionDetailsPage';

const ExtensionDetailsPage: FC = () => {
  const { extensionId } = useParams();
  const { pathname } = useLocation();
  const { colony, refetchColony } = useColonyContext();
  const navigate = useNavigate();
  const { extensionData, refetchExtensionData } = useExtensionData(
    extensionId ?? '',
  );
  const [waitingForEnableConfirmation, setWaitingForEnableConfirmation] =
    useState(false);

  if (!colony || !extensionData) {
    return null;
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
    mergePayload({ colonyAddress: colony?.colonyAddress, extensionData }),
  );

  const schema = getValidationSchema({ initializationParams });

  const defaultValues = {
    type: extensionData.extensionId,
    option: '',
    params: initialValues,
  };

  const handleFormSuccess = getFormSuccessFn<typeof defaultValues>({
    colonyName: colony.name,
    extensionData,
    navigate,
    refetchColony,
    refetchExtensionData,
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
      <ThreeColumns
        leftAside={null}
        topRow={
          <ExtensionsTopRow
            extensionData={extensionData}
            isSetupRoute={isSetupRoute}
            waitingForEnableConfirmation={waitingForEnableConfirmation}
          />
        }
        withSlider={!isSetupRoute && <ImageCarousel />}
        rightAside={<ExtensionDetails extensionData={extensionData} />}
      >
        <Routes>
          <Route
            path="/"
            element={<ExtensionInfo extensionData={extensionData} />}
          />
          {SetupComponent && (
            <Route
              path={COLONY_EXTENSION_SETUP_ROUTE}
              element={<SetupComponent extensionData={extensionData} />}
            />
          )}
          <Route path="*" element={<NotFoundRoute />} />
        </Routes>
      </ThreeColumns>
    </ActionForm>
  );
};

ExtensionDetailsPage.displayName = displayName;

export default ExtensionDetailsPage;
