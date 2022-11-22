import React, { useCallback, useEffect, useState } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import * as yup from 'yup';

import Heading from '~shared/Heading';
import QuestionMarkTooltip from '~shared/QuestionMarkTooltip';
import { Form, Toggle } from '~shared/Fields';
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
    defaultMessage: `To connect directly to Gnosis chain and pay for your own transactions, disable this option. `,
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
  tooltip: {
    id: 'users.UserProfileEdit.UserAdvanceSettings.tooltip',
    defaultMessage: `Metatransactions are turned on by default.
    If you would rather connect directly to the chain,
    and pay for your own transactions, you can turn them off
    by switching the toggle at any time. {br}{br} Please note,
    this setting is stored locally in your browser,
    if you clear your cache you will need to turn Metatransactions off again.`,
  },
  snackbarSuccess: {
    id: 'users.UserProfileEdit.UserAdvanceSettings.snackbarSuccess',
    defaultMessage: 'Profile settings have been updated.',
  },
});

interface FormValues {
  metatransactions: boolean;
}

const validationSchema = yup.object({
  metatransactions: yup.bool(),
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
    settings: { metatransactions: metatransactionsSetting },
    setSettingsKey,
  } = useUserSettings();

  const onChange = useCallback(
    (oldValue) => {
      setSettingsKey(SlotKey.Metatransactions, !oldValue);
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
        metatransactions: metatransasctionsAvailable,
      }}
      validationSchema={validationSchema}
      onSubmit={() => {}}
    >
      {({ isSubmitting }) => (
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
                isOn: metatransasctionsAvailable,
              }}
              name="metatransactions"
              disabled={!metatransasctionsToggleAvailable}
              onChange={onChange}
            />
            <QuestionMarkTooltip
              tooltipText={MSG.tooltip}
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
          {metatransasctionsToggleAvailable && (
            <>
              <Button
                text={{ id: 'button.save' }}
                loading={isSubmitting}
                onClick={() => setShowSnackbar(true)}
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
