import React, { useMemo } from 'react';
import { type FC, type PropsWithChildren } from 'react';

import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
import { useExtensionDetailsPageContext } from '~frame/Extensions/pages/ExtensionDetailsPage/context/ExtensionDetailsPageContext.ts';
import useExtensionData from '~hooks/useExtensionData.ts';
import { ActionForm } from '~shared/Fields/index.ts';
import { mapPayload, mergePayload, pipe } from '~utils/actions.ts';

import {
  getFormSuccessFn,
  getExtensionSettingsActionType,
  mapExtensionActionPayload,
  getExtensionSettingsDefaultValues,
  getFormErrorFn,
} from './utils.tsx';
import { getValidationSchema } from './validation.ts';

const ExtensionSettingsForm: FC<PropsWithChildren> = ({ children }) => {
  const {
    colony: { colonyAddress },
  } = useColonyContext();
  const {
    extensionData,
    setActiveTab,
    setWaitingForActionConfirmation,
    setIsSavingChanges,
  } = useExtensionDetailsPageContext();
  const { refetchExtensionData } = useExtensionData(extensionData?.extensionId);

  const defaultValues = useMemo(
    () => getExtensionSettingsDefaultValues(extensionData),
    [extensionData],
  );

  const { initializationParams = [] } = extensionData;

  const transform = pipe(
    mapPayload((values) =>
      mapExtensionActionPayload(extensionData, values, initializationParams),
    ),
    mergePayload({ colonyAddress, extensionData }),
  );

  const validationSchema = getValidationSchema(extensionData);

  const handleFormSuccess = getFormSuccessFn<typeof defaultValues>({
    extensionData,
    refetchExtensionData,
    setWaitingForActionConfirmation,
    setIsSavingChanges,
    setActiveTab,
  });

  const handleFormError = getFormErrorFn<typeof defaultValues>({
    extensionData,
    refetchExtensionData,
    setWaitingForActionConfirmation,
    setIsSavingChanges,
    setActiveTab,
  });

  return (
    <ActionForm<typeof defaultValues>
      actionType={getExtensionSettingsActionType(extensionData)}
      transform={transform}
      defaultValues={defaultValues}
      validationSchema={validationSchema}
      onSuccess={handleFormSuccess}
      onError={handleFormError}
    >
      {children}
    </ActionForm>
  );
};

export default ExtensionSettingsForm;
