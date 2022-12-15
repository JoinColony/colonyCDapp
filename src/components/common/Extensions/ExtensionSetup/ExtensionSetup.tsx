import React, { useCallback, useMemo } from 'react';
import { FormikProps } from 'formik';
import {
  Navigate,
  useLocation,
  useParams,
  useNavigate,
} from 'react-router-dom';
import { defineMessages, FormattedMessage, useIntl } from 'react-intl';

// import { useHistory, useParams, Redirect } from 'react-router';
import { endsWith } from 'lodash';
import { Extension } from '@colony/colony-js';
import Decimal from 'decimal.js';
import { useMediaQuery } from 'react-responsive';
import { useColonyContext } from '~hooks';

import { IconButton, ActionButton } from '~shared/Button';
import { Input, ActionForm, Textarea } from '~shared/Fields';
import Heading from '~shared/Heading';

import { ColonyExtension, ExtensionConfig } from '~types';

import {
  ExtensionData,
  ExtensionParamType,
} from '~data/staticData/extensionData';
import { mergePayload, mapPayload, pipe } from '~utils/actions';

import {
  createExtensionInitValidation,
  createExtensionDefaultValues,
  getButtonAction,
} from './utils';

import ComplementaryLabel from './ComplementaryLabel';

import { query700 as query } from '~styles/queries.css';
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
  descriptionMissingPermissions: {
    id: `${displayName}.descriptionMissingPermissions`,
    defaultMessage: `This Extension needs certain permissions in the Colony. Click here to set them.`,
  },
  setPermissions: {
    id: `${displayName}.setPermissions`,
    defaultMessage: 'Set permissions',
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
  initParams: {
    id: `${displayName}.initParams`,
    defaultMessage: 'Initialization parameters',
  },
  tokenValidationError: {
    id: `${displayName}.tokenValidationError`,
    defaultMessage: `Error: The Token to be sold needs to be different from the purchase Token.`,
  },
  targetPerPeriodError: {
    id: `${displayName}.targetPerPeriodError`,
    defaultMessage: `Error: Target per period value cannot exceed the Maximum per period value.`,
  },
  maxPerPeriodError: {
    id: `${displayName}.maxPerPeriodError`,
    defaultMessage: `Error: Maximum per period value cannot be lower than then Target per period value.`,
  },
});

interface Props {
  extensionConfig: ExtensionConfig;
  installedExtension: ColonyExtension;
}
const ExtensionSetup = ({
  extensionConfig: { initializationParams },
  installedExtension,
}: Props) => {
  const { extensionId } = useParams();
  const { colony } = useColonyContext();
  const colonyAddress = colony?.colonyAddress || '';
  const { extensionData, loading } = useExtensionData(extensionId ?? '');
  const { pathname } = useLocation();

  // const { colonyName, extensionId } = useParams<{
  //   colonyName: string;
  //   extensionId: string;
  // }>();
  const navigate = useNavigate();
  const isMobile = useMediaQuery({ query });
  const { formatMessage } = useIntl();

  const handleFormSuccess = useCallback(() => {
    navigate(`/colony/${colony?.name}/extensions/${extensionId}`, {
      replace: true,
    });
  }, [navigate, colony?.name, extensionId]);

  const transform = useCallback(
    pipe(
      mapPayload((payload) => {
        if (extensionId === Extension.VotingReputation) {
          const formattedPayload = {};
          initializationParams?.map(({ paramName }) => {
            if (endsWith(paramName, 'Period')) {
              formattedPayload[paramName] = new Decimal(payload[paramName])
                .mul(3600) // Seconds in 1 hour
                .toFixed(0, Decimal.ROUND_HALF_UP);
            } else {
              formattedPayload[paramName] = new Decimal(payload[paramName])
                .mul(new Decimal(10).pow(16))
                .toString();
            }
          });
          return formattedPayload;
        }
        return payload;
      }),
      mergePayload({ colonyAddress, extensionId }),
    ),
    [colonyAddress, extensionId, initializationParams],
  );

  const initialValues = useMemo(() => {
    if (!initializationParams) {
      return {};
    }
    return createExtensionDefaultValues(initializationParams);
  }, [initializationParams]);

  if (
    installedExtension?.isDeprecated ||
    installedExtension?.isInitialized
    // && !installedExtension?.missingPermissions.length) //@TODO add support for permissions
  ) {
    return (
      <Navigate
        to={`/colony/${colony?.name}/extensions/${extensionId}`}
        replace
      />
    );
  }

  // This is a special case that should not happen. Used to recover the
  // missing permission transactions
  if (
    installedExtension?.isInitialized
    // && installedExtension?.missingPermissions.length
  ) {
    return (
      <div className={styles.main}>
        <Heading
          appearance={{ size: 'medium', margin: 'none' }}
          text={MSG.title}
        />
        <FormattedMessage {...MSG.descriptionMissingPermissions} />
        <div className={styles.inputContainer}>
          <ActionButton
            submit={getButtonAction('SUBMIT')}
            error={getButtonAction('ERROR')}
            success={getButtonAction('SUCCESS')}
            transform={transform}
            text={MSG.setPermissions}
          />
        </div>
      </div>
    );
  }

  if (!initializationParams) return null;

  const makeSpan = (chunks) => (
    <span className={styles.descriptionExample}>{chunks}</span>
  );

  const displayParams = (params, formikBag, isExtraParams) =>
    params.map(
      ({ paramName, title, description, type, complementaryLabel }) => {
        return (
          <div
            key={paramName}
            className={isExtraParams ? styles.extraParams : ''}
          >
            {type === ExtensionParamType.Input && (
              <div
                className={`${styles.input} ${
                  paramName.endsWith('Address') ? styles.addressInput : ''
                }`}
              >
                <div className={styles.inputWrapper}>
                  <Input
                    appearance={{ size: 'medium', theme: 'minimal' }}
                    label={title}
                    name={paramName}
                    forcedFieldError={
                      formikBag?.status?.[paramName]
                        ? MSG[`${paramName}Error`]
                        : undefined
                    }
                    disabled={formikBag.isSubmitting}
                  />
                  {isMobile && (
                    <ComplementaryLabel
                      labelText={formatMessage(MSG[complementaryLabel])}
                    />
                  )}
                </div>
                <p className={styles.inputsDescription}>
                  <FormattedMessage
                    {...description}
                    values={{
                      span: makeSpan,
                    }}
                  />
                </p>
                {!isMobile && (
                  <ComplementaryLabel
                    labelText={formatMessage(MSG[complementaryLabel])}
                  />
                )}
              </div>
            )}
            {type === ExtensionParamType.Textarea && (
              <div className={styles.textArea}>
                <Textarea
                  appearance={{ colorSchema: 'grey' }}
                  label={title}
                  name={paramName}
                  disabled={formikBag.isSubmitting}
                  extra={
                    description && (
                      <p className={styles.textAreaDescription}>
                        <FormattedMessage {...description} />
                      </p>
                    )
                  }
                />
              </div>
            )}
          </div>
        );
      },
    );

  return (
    <ActionForm
      initialValues={initialValues}
      validationSchema={createExtensionInitValidation(initializationParams)}
      submit={getButtonAction('SUBMIT')}
      error={getButtonAction('ERROR')}
      success={getButtonAction('SUCCESS')}
      onSuccess={handleFormSuccess}
      transform={transform}
    >
      {({
        handleSubmit,
        isSubmitting,
        isValid,
        ...formikBag
      }: FormikProps<object>) => (
        <div className={styles.main}>
          <Heading
            appearance={{ size: 'medium', margin: 'none' }}
            text={MSG.title}
            id="enableExtnTitle"
          />
          <FormattedMessage {...MSG.description} />
          <div className={styles.inputContainer}>
            {displayParams(
              initializationParams,
              { ...formikBag, isSubmitting },
              false,
            )}
          </div>
          <IconButton
            appearance={{ theme: 'primary', size: 'large' }}
            onClick={() => handleSubmit()}
            text={{ id: 'button.confirm' }}
            loading={isSubmitting}
            disabled={
              !isValid ||
              Object.values(formikBag?.status || {}).some((value) => !!value) ||
              isSubmitting
            }
            data-test="setupExtensionConfirmButton"
          />
        </div>
      )}
    </ActionForm>
  );
};

export default ExtensionSetup;
