import React, { useCallback, useMemo } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import { Navigate, useNavigate } from 'react-router-dom';
import { InferType } from 'yup';

import { useColonyContext } from '~hooks';
import { ActionForm } from '~shared/Fields';
import Heading from '~shared/Heading';
import { InstalledExtensionData } from '~types';
import { mapPayload, mergePayload, pipe } from '~utils/actions';
import { IconButton } from '~shared/Button';
import { ActionTypes } from '~redux';
import { useColonyHomeContext } from '~context';
import { COLONY_EXTENSIONS_ROUTE } from '~routes';

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
  const { shortPollExtensions } = useColonyHomeContext();
  const transform = pipe(
    mapPayload((payload) =>
      mapExtensionActionPayload(payload, initializationParams),
    ),
    mergePayload({ colonyAddress: colony?.colonyAddress, extensionData }),
  );

  const handleFormSuccess = useCallback(async () => {
    shortPollExtensions();
    navigate(`/${colony?.name}/${COLONY_EXTENSIONS_ROUTE}/${extensionId}`);
  }, [colony?.name, extensionId, navigate, shortPollExtensions]);

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
    return (
      <Navigate
        to={`/${colony.name}/${COLONY_EXTENSIONS_ROUTE}/${extensionId}`}
      />
    );
  }

  const schema = createExtensionSetupValidationSchema(initializationParams);
  type FormValues = InferType<typeof schema>;

  return (
    <ActionForm<FormValues>
      defaultValues={initialValues}
      validationSchema={schema}
      actionType={ActionTypes.EXTENSION_ENABLE}
      onSuccess={handleFormSuccess}
      transform={transform}
    >
      {({ formState: { isValid, isSubmitting } }) => {
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
              disabled={!isValid || isSubmitting}
            />
          </div>
        );
      }}
    </ActionForm>
  );
};

ExtensionSetup.displayName = displayName;

export default ExtensionSetup;
