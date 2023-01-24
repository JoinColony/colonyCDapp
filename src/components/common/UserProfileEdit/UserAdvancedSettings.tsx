import React, { useState } from 'react';
import { defineMessages } from 'react-intl';
import { string, bool, object, InferType } from 'yup';

import { HookForm as Form } from '~shared/Fields';
import { Heading3 } from '~shared/Heading';
import ExternalLink from '~shared/ExternalLink';
import { ADVANCED_SETTINGS } from '~constants';
import useUserSettings, {
  SlotKey,
  UserSettingsHook,
} from '~hooks/useUserSettings';
import { canUseMetatransactions } from '~utils/checks';
import { yupDebounce } from '~utils/yup/tests';

import AdvancedSettingsRow, {
  getAdvancedSettingsRows,
} from './AdvancedSettingsRow';
import SaveForm from './SaveForm';
import { isValidURL, validateCustomGnosisRPC } from './validation';

import styles from './UserAdvancedSettings.css';

const displayName = 'common.UserProfileEdit.UserAdvancedSettings';

const MSG = defineMessages({
  heading: {
    id: `${displayName}.heading`,
    defaultMessage: 'Advanced settings {learnMoreLink}',
  },
  invalidURLError: {
    id: `${displayName}.invalidURLError`,
    defaultMessage: 'Enter a valid URL',
  },
  invalidRPCError: {
    id: `${displayName}.invalidRPCError`,
    defaultMessage: 'Unable to validate RPC endpoint',
  },
});

const validationSchema = object({
  [SlotKey.Metatransactions]: bool<boolean>(),
  [SlotKey.DecentralizedMode]: bool<boolean>(),
  [SlotKey.CustomRPC]: string()
    .defined()
    .when(`${[SlotKey.DecentralizedMode]}`, {
      is: true,
      then: string()
        .required(() => MSG.invalidURLError)
        .url(() => MSG.invalidURLError)
        .test(
          'gnosisRpc',
          () => MSG.invalidRPCError,
          yupDebounce(validateCustomGnosisRPC, 200, {
            isOptional: false,
            circuitBreaker: isValidURL,
          }),
        ),
    }),
}).defined();

export type FormValues = InferType<typeof validationSchema>;

const setFormValuesToLocalStorage = (
  values: FormValues,
  setSettingsKey: UserSettingsHook['setSettingsKey'],
) => {
  Object.entries(values).forEach(([key, value]: [SlotKey, string | boolean]) =>
    setSettingsKey(key, value),
  );
};

const metatransactionsAvailable = canUseMetatransactions();
const advancedSettingsRows = getAdvancedSettingsRows(metatransactionsAvailable);
const headingTextValues = {
  learnMoreLink: (
    <ExternalLink
      text={{ id: 'text.learnMore' }}
      href={ADVANCED_SETTINGS}
      className={styles.learnMoreLink}
      key="learnMore"
    />
  ),
};

const UserAdvancedSettings = () => {
  const [showSnackbar, setShowSnackbar] = useState<boolean>(false);
  const {
    settings: {
      metatransactions: metatransactionsSetting,
      decentralizedModeEnabled,
      customRpc,
    },
    setSettingsKey,
  } = useUserSettings();

  const metatransasctionsDefault = metatransactionsAvailable
    ? metatransactionsSetting
    : false;

  const handleSubmit = (values: FormValues) => {
    setFormValuesToLocalStorage(values, setSettingsKey);
  };

  return (
    <>
      <Heading3
        appearance={{ theme: 'dark' }}
        text={MSG.heading}
        textValues={headingTextValues}
      />
      <Form<FormValues>
        defaultValues={{
          [SlotKey.Metatransactions]: metatransasctionsDefault,
          [SlotKey.DecentralizedMode]: decentralizedModeEnabled,
          [SlotKey.CustomRPC]: customRpc,
        }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        resetOnSubmit
      >
        {({ formState: { isValid, isDirty, isValidating } }) => (
          <div className={styles.main}>
            {advancedSettingsRows.map((row) => (
              <AdvancedSettingsRow
                name={row.name}
                paragraphText={row.paragraphText}
                toggleDisabled={!metatransactionsAvailable}
                toggleLabel={row.toggleLabel}
                tooltipText={row.tooltipText}
                tooltipTextValues={row.tooltipTextValues}
                extra={row.extra}
                key={row.name}
              />
            ))}
            <SaveForm
              disabled={
                !metatransactionsAvailable ||
                !isValid ||
                !isDirty ||
                isValidating
              }
              setShowSnackbar={setShowSnackbar}
              showSnackbar={showSnackbar}
            />
          </div>
        )}
      </Form>
    </>
  );
};

UserAdvancedSettings.displayName = displayName;

export default UserAdvancedSettings;
