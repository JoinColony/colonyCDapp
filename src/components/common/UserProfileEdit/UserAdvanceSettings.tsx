import React, { useCallback, useEffect, useState } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import * as yup from 'yup';

import Heading from '~shared/Heading';
import QuestionMarkTooltip from '~shared/QuestionMarkTooltip';
import { Form, Input, Toggle } from '~shared/Fields';
import Snackbar, { SnackbarType } from '~shared/Snackbar';
import Button from '~shared/Button';

import useUserSettings, { SlotKey } from '~hooks/useUserSettings';
import { canUseMetatransactions } from '~utils/checks';

import styles from './UserProfileEdit.css';
import stylesAdvance from './UserAdvanceSettings.css';
import ExternalLink from '~shared/ExternalLink';

const MSG = defineMessages({
  heading: {
    id: 'users.UserProfileEdit.UserAdvanceSettings.heading',
    defaultMessage: 'Advanced settings {learnMoreLink}',
  },
  metaDescription: {
    id: 'users.UserProfileEdit.UserAdvanceSettings.metaDescription',
    defaultMessage: `To connect directly to Gnosis chain and pay for your own transactions, disable this option.`,
  },
  metaDescGlobalOff: {
    id: 'users.UserProfileEdit.UserAdvanceSettings.metaDescGlobalOff',
    defaultMessage: `Metatransactions are disabled globally.`,
  },
  labelMetaTx: {
    id: 'users.UserProfileEdit.UserAdvanceSettings.labelMetaTx',
    defaultMessage: `Metatransactions ({isOn, select,
      true {active}
      other {inactive}
    })`,
  },
  metaTooltip: {
    id: 'users.UserProfileEdit.UserAdvanceSettings.metaTooltip',
    defaultMessage: `Metatransactions are turned on by default.
    If you would rather connect directly to the chain,
    and pay for your own transactions, you can turn them off
    by switching the toggle at any time. {br}{br} Please note,
    this setting is stored locally in your browser,
    if you clear your cache you will need to turn Metatransactions off again.`,
  },
  customEndpoints: {
    id: 'users.UserProfileEdit.UserAdvanceSettings.customEndpoints',
    defaultMessage: `Enable custom endpoints ({isOn, select,
      true {active}
      other {inactive}
    })`,
  },
  endpointsDescription: {
    id: 'users.UserProfileEdit.UserAdvanceSettings.metaDescription',
    defaultMessage: `If you prefer maximum decentralisation, you may use your own custom endpoints for Colony.`,
  },
  labelGnosisRPC: {
    id: 'users.UserProfileEdit.UserAdvanceSettings.labelGnosisRPC',
    defaultMessage: 'Gnosis Chain RPC',
  },
  gnosisRPCTooltip: {
    id: 'users.UserProfileEdit.UserAdvanceSettings.gnosisRPCTooltip',
    defaultMessage: `You will be able to toggle the Gnosis Chain RPC on once you have successfully validated that the endpoint works.`,
  },
  validate: {
    id: 'users.UserProfileEdit.UserAdvanceSettings.validate',
    defaultMessage: 'Validate',
  },
  snackbarSuccess: {
    id: 'users.UserProfileEdit.UserAdvanceSettings.snackbarSuccess',
    defaultMessage: 'Profile settings have been updated.',
  },
});

interface FormValues {
  [SlotKey.Metatransactions]: boolean;
  [SlotKey.DecentralizedMode]: boolean;
  [SlotKey.CustomRPC]: string;
}

const validationSchema = yup.object({
  [SlotKey.Metatransactions]: yup.bool(),
  [SlotKey.DecentralizedMode]: yup.bool(),
  [SlotKey.CustomRPC]: yup.string().url(),
});

const displayName = 'users.UserProfileEdit.UserAdvanceSettings';

const UserAdvanceSettings = () => {
  const [showSnackbar, setShowSnackbar] = useState<boolean>(false);
  useEffect(() => {
    if (showSnackbar) {
      const timeout = setTimeout(() => setShowSnackbar(true), 200000);
      return () => {
        clearTimeout(timeout);
      };
    }
    return undefined;
  }, [showSnackbar]);

  const {
    settings: {
      metatransactions: metatransactionsSetting,
      decentralizedModeEnabled,
      customRpc,
    },
    setSettingsKey,
  } = useUserSettings();

  const onSubmit = useCallback(
    (values) => {
      Object.entries(values).forEach(
        ([key, value]: [SlotKey, string | boolean]) =>
          setSettingsKey(key, value),
      );
    },
    [setSettingsKey],
  );

  const metatransasctionsToggleAvailable = canUseMetatransactions();

  const metatransasctionsAvailable = metatransasctionsToggleAvailable
    ? metatransactionsSetting
    : false;

  return (
    <Form<FormValues>
      initialValues={{
        [SlotKey.Metatransactions]: metatransasctionsAvailable,
        [SlotKey.DecentralizedMode]: decentralizedModeEnabled,
        [SlotKey.CustomRPC]: customRpc,
      }}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
    >
      {({ isValid, values, submitForm }) => (
        <div className={styles.main}>
          <Heading
            appearance={{ theme: 'dark', size: 'medium' }}
            text={MSG.heading}
            textValues={{
              // @ts-ignore
              learnMoreLink: (
                <ExternalLink
                  text={{ id: 'text.learnMore' }}
                  href=""
                  className={stylesAdvance.link}
                />
              ),
            }}
          />
          <div className={stylesAdvance.toggleContainer}>
            <Toggle
              label={MSG.labelMetaTx}
              labelValues={{
                isOn: values[SlotKey.Metatransactions],
              }}
              name={SlotKey.Metatransactions}
              disabled={!metatransasctionsToggleAvailable}
            />
            <QuestionMarkTooltip
              tooltipText={MSG.metaTooltip}
              /* @ts-ignore */
              tooltipTextValues={{ br: <br /> }}
              className={stylesAdvance.tooltipContainer}
              tooltipClassName={stylesAdvance.tooltipContent}
              tooltipPopperOptions={{
                placement: 'right',
              }}
            />
          </div>
          <p className={stylesAdvance.descriptions}>
            <FormattedMessage {...MSG.metaDescription} />
          </p>
          {!metatransasctionsToggleAvailable && (
            <div className={stylesAdvance.metaDesc}>
              <FormattedMessage {...MSG.metaDescGlobalOff} />
            </div>
          )}
          <hr />
          <div className={stylesAdvance.sectionTitle}>
            <FormattedMessage
              {...MSG.customEndpoints}
              values={{ isOn: values[SlotKey.DecentralizedMode] }}
            />
          </div>
          <p className={stylesAdvance.descriptions}>
            <FormattedMessage {...MSG.metaDescription} />
          </p>
          <div className={stylesAdvance.toggleContainer}>
            <Toggle
              label={MSG.labelGnosisRPC}
              labelValues={{ isOn: decentralizedModeEnabled }}
              name={SlotKey.DecentralizedMode}
            />
            <QuestionMarkTooltip
              tooltipText={MSG.gnosisRPCTooltip}
              className={stylesAdvance.tooltipContainer}
              tooltipClassName={stylesAdvance.tooltipContent}
              tooltipPopperOptions={{
                placement: 'right',
              }}
            />
          </div>
          <Input
            name={SlotKey.CustomRPC}
            disabled={!values[SlotKey.DecentralizedMode]}
          />
          <div className={stylesAdvance.validateButtonContainer}>
            <Button
              text={MSG.validate}
              disabled={!values[SlotKey.DecentralizedMode] || !isValid}
            />
          </div>
          <hr />
          {metatransasctionsToggleAvailable && (
            <>
              <Button
                text={{ id: 'button.save' }}
                onClick={() => {
                  submitForm();
                  setShowSnackbar(true);
                }}
                disabled={!metatransasctionsToggleAvailable}
              />
              <Snackbar
                show={showSnackbar}
                setShow={setShowSnackbar}
                msg={MSG.snackbarSuccess}
                type={SnackbarType.Success}
              />
            </>
          )}
        </div>
      )}
    </Form>
  );
};

UserAdvanceSettings.displayName = displayName;

export default UserAdvanceSettings;
