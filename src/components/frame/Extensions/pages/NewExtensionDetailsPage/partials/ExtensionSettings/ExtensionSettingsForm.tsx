import React, { useMemo } from 'react';
import { type FC, type PropsWithChildren } from 'react';

import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
import { mapExtensionActionPayload } from '~frame/Extensions/pages/ExtensionDetailsPage/utils.tsx';
import { getValidationSchema } from '~frame/Extensions/pages/ExtensionDetailsPage/validation.ts';
import { useExtensionDetailsPageContext } from '~frame/Extensions/pages/NewExtensionDetailsPage/context/ExtensionDetailsPageContext.ts';
import {
  getExtensionParams,
  getExtensionSettingsActionType,
} from '~frame/Extensions/pages/NewExtensionDetailsPage/utils.tsx';
import { ActionForm } from '~shared/Fields/index.ts';
import { mapPayload, mergePayload, pipe } from '~utils/actions.ts';

const ExtensionSettingsForm: FC<PropsWithChildren> = ({ children }) => {
  const {
    colony: { colonyAddress },
  } = useColonyContext();
  const { extensionData } = useExtensionDetailsPageContext();

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

  const validationSchema = getValidationSchema({ initializationParams });

  // const handleFormSuccess = getFormSuccessFn<typeof defaultValues>({
  //   colonyName,
  //   extensionData,
  //   navigate,
  //   refetchColony,
  //   refetchExtensionData,
  //   setWaitingForActionConfirmation,
  // });

  return (
    <ActionForm
      actionType={getExtensionSettingsActionType(extensionData)}
      transform={transform}
      defaultValues={defaultValues}
      validationSchema={validationSchema}
    >
      {children}
    </ActionForm>
  );
};

export default ExtensionSettingsForm;
