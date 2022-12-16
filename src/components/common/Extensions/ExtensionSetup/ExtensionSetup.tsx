import React, { useCallback, useMemo } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import { Navigate, useNavigate } from 'react-router-dom';
import { FormikProps } from 'formik';
import { Extension } from '@colony/colony-js';
import Decimal from 'decimal.js';

import { useColonyContext } from '~hooks';
import { ActionForm, Input } from '~shared/Fields';
import Heading from '~shared/Heading';
import { ExtensionParamType, InstalledExtensionData } from '~types';
import { mapPayload, mergePayload, pipe } from '~utils/actions';
import { IconButton } from '~shared/Button';

import { createExtensionInitialValues, getButtonAction } from './utils';

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
  hours: {
    id: `${displayName}.hours`,
    defaultMessage: 'hours',
  },
  periods: {
    id: `${displayName}.periods`,
    defaultMessage: 'periods',
  },
  percent: {
    id: `${displayName}.percent`,
    defaultMessage: '%',
  },
});

const DescriptionChunks = (chunks: React.ReactNode[]) => (
  <span className={styles.descriptionExample}>{chunks}</span>
);

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
    mapPayload((payload) => {
      if (extensionId === Extension.VotingReputation) {
        return initializationParams?.reduce(
          (formattedPayload, { paramName }) => {
            if (paramName.endsWith('Period')) {
              return {
                ...formattedPayload,
                [paramName]: new Decimal(payload[paramName])
                  .mul(3600)
                  .toFixed(0, Decimal.ROUND_HALF_UP),
              };
            }
            return {
              ...formattedPayload,
              [paramName]: new Decimal(payload[paramName])
                .mul(new Decimal(10).pow(16))
                .toString(),
            };
          },
          {},
        );
      }

      return payload;
    }),
    mergePayload({ colonyAddress: colony?.colonyAddress, extensionData }),
  );

  const handleFormSuccess = useCallback(() => {
    navigate(`/colony/${colony?.name}/extensions/${extensionId}`);
  }, [colony?.name, extensionId, navigate]);

  const initialValues = useMemo(() => {
    if (!initializationParams) {
      return {};
    }
    return createExtensionInitialValues(initializationParams);
  }, [initializationParams]);

  if (!colony || !initializationParams) {
    return null;
  }

  if (isInitialized || isDeprecated) {
    return <Navigate to={`/colony/${colony.name}/extensions/${extensionId}`} />;
  }

  const renderParams = (
    // using any since this will be refactored into react-hook-form anyway
    formikProps: FormikProps<any>,
  ) =>
    initializationParams.map(
      ({ paramName, type, title, description, complementaryLabel }) => (
        <div key={paramName}>
          {type === ExtensionParamType.Input && (
            <div className={styles.input}>
              <Input
                appearance={{ size: 'medium', theme: 'minimal' }}
                label={title}
                name={paramName}
                disabled={formikProps.isSubmitting}
              />
              <p className={styles.inputsDescription}>
                <FormattedMessage
                  {...description}
                  values={{
                    span: DescriptionChunks,
                  }}
                />
              </p>
              {complementaryLabel && (
                <span className={styles.complementaryLabel}>
                  <FormattedMessage {...MSG[complementaryLabel]} />
                </span>
              )}
            </div>
          )}
        </div>
      ),
    );

  return (
    <ActionForm
      initialValues={initialValues}
      submit={getButtonAction('SUBMIT', extensionId)}
      error={getButtonAction('ERROR', extensionId)}
      success={getButtonAction('SUCCESS', extensionId)}
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
              {renderParams(formikProps)}
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
