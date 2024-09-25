import React, { useMemo } from 'react';
import { type FC, type PropsWithChildren } from 'react';

import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
import { useExtensionDetailsPageContext } from '~frame/Extensions/pages/NewExtensionDetailsPage/context/ExtensionDetailsPageContext.ts';
import useExtensionData from '~hooks/useExtensionData.ts';
import { ActionForm } from '~shared/Fields/index.ts';
import { mapPayload, mergePayload, pipe } from '~utils/actions.ts';

import {
  getFormSuccessFn,
  getExtensionSettingsActionType,
  mapExtensionActionPayload,
  getExtensionSettingsDefaultValues,
} from './utils.tsx';
import { getValidationSchema } from './validation.ts';

const ExtensionSettingsForm: FC<PropsWithChildren> = ({ children }) => {
  const {
    colony: { colonyAddress },
    refetchColony,
  } = useColonyContext();
  const { extensionData, setActiveTab, setWaitingForActionConfirmation } =
    useExtensionDetailsPageContext();
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
    refetchColony,
    refetchExtensionData,
    setWaitingForActionConfirmation,
    setActiveTab,
  });

  return (
    <ActionForm<typeof defaultValues>
      actionType={getExtensionSettingsActionType(extensionData)}
      transform={transform}
      defaultValues={defaultValues}
      validationSchema={validationSchema}
      onSuccess={handleFormSuccess}
    >
      {children}
    </ActionForm>
  );
};

export default ExtensionSettingsForm;
