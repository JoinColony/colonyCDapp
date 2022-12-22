import React, { useCallback, useMemo } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import { Navigate, useNavigate } from 'react-router-dom';

import { useColonyContext } from '~hooks';
import { ActionForm } from '~shared/Fields';
import Heading from '~shared/Heading';
import { InstalledExtensionData } from '~types';
import { mapPayload, mergePayload, pipe } from '~utils/actions';
import { IconButton } from '~shared/Button';
import { ActionTypes } from '~redux';

import {
  createExtensionSetupInitialValues,
  createExtensionSetupValidationSchema,
  mapExtensionActionPayload,
} from './utils';
import InitParamField from './InitParamField';

import styles from './ExtensionSetup.css';

const displayName = 'common.Extensions.ExtensionSetup';

const MSG = defineMessages({
  title: {
    id: `${displayName}.title`,
    defaultMessage: 'Enable extension',
  },
  description: {
    id: `${displayName}.description`,
    defaultMessage: `Enabling this extension requires additional parameters. These parameters cannot be changed after enabling it. To do so, you must uninstall the extension, and then install and enable it again with new parameters.`,
  },
});

interface Props {
  extensionData: InstalledExtensionData;
}

const ExtensionSetup = ({
  extensionData,
  extensionData: {
    isInitialized,
    isDeprecated,
    extensionId,
    initializationParams,
  },
}: Props) => {
  const navigate = useNavigate();
  const { colony } = useColonyContext();

  const transform = pipe(
    mapPayload((payload) =>
      mapExtensionActionPayload(extensionId, payload, initializationParams),
    ),
    mergePayload({ colonyAddress: colony?.colonyAddress, extensionData }),
  );

  const handleFormSuccess = useCallback(() => {
    navigate(`/colony/${colony?.name}/extensions/${extensionId}`);
  }, [colony?.name, extensionId, navigate]);

  const initialValues = useMemo(() => {
    if (!initializationParams) {
      return {};
    }
    return createExtensionSetupInitialValues(initializationParams);
  }, [initializationParams]);

  if (!colony) {
    return null;
  }

  if (isInitialized || isDeprecated || !initializationParams) {
    return <Navigate to={`/colony/${colony.name}/extensions/${extensionId}`} />;
  }

  return (
    <ActionForm
      initialValues={initialValues}
      validationSchema={createExtensionSetupValidationSchema(
        initializationParams,
      )}
      submit={ActionTypes.EXTENSION_ENABLE}
      error={ActionTypes.EXTENSION_ENABLE_ERROR}
      success={ActionTypes.EXTENSION_ENABLE_SUCCESS}
      onSuccess={handleFormSuccess}
      transform={transform}
    >
      {(formikProps) => {
        const { isSubmitting, isValid, status } = formikProps;
        return (
          <div>
            <Heading
              appearance={{ size: 'medium', margin: 'none' }}
              text={MSG.title}
            />

            <FormattedMessage {...MSG.description} />

            <div className={styles.inputContainer}>
              {initializationParams.map((param) => (
                <InitParamField key={param.paramName} param={param} />
              ))}
            </div>

            <IconButton
              type="submit"
              appearance={{ theme: 'primary', size: 'large' }}
              text={{ id: 'button.confirm' }}
              loading={isSubmitting}
              disabled={
                !isValid ||
                Object.values(status || {}).some((value) => !!value) ||
                isSubmitting
              }
            />
          </div>
        );
      }}
    </ActionForm>
  );
};

ExtensionSetup.displayName = displayName;

export default ExtensionSetup;
