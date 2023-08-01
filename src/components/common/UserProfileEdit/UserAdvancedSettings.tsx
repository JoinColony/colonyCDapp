import React, { useState } from 'react';
import { defineMessages } from 'react-intl';
import { string, bool, object, InferType } from 'yup';

import { Form } from '~shared/Fields';
import { Heading3 } from '~shared/Heading';
import ExternalLink from '~shared/ExternalLink';
import { ADVANCED_SETTINGS } from '~constants';
import { canUseMetatransactions } from '~utils/checks';
import { yupDebounce } from '~utils/yup/tests';
import { useAppContext } from '~hooks';
import { useUpdateUserProfileMutation } from '~gql';
import { User } from '~types';

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
  metatransactionsEnabled: bool<boolean>(),
  decentralizedModeEnabled: bool<boolean>(),
  customRpc: string()
    .defined()
    .when('decentralizedModeEnabled', {
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

interface Props {
  user: User;
}

const UserAdvancedSettings = ({ user: { walletAddress, profile } }: Props) => {
  const [showSnackbar, setShowSnackbar] = useState<boolean>(false);
  const { updateUser } = useAppContext();
  const [editUser, { error }] = useUpdateUserProfileMutation();

  const metatransasctionsDefault = Boolean(
    profile?.advancedSettings?.metatransactionsEnabled,
  );

  const defaultValues = {
    metatransactionsEnabled: metatransasctionsDefault,
    decentralizedModeEnabled:
      profile?.advancedSettings?.decentralizedModeEnabled || false,
    customRpc: profile?.advancedSettings?.customRpc || '',
  };

  const handleSubmit = async (updatedAdvancedSettings: FormValues) => {
    await editUser({
      variables: {
        input: {
          id: walletAddress,
          advancedSettings: {
            ...updatedAdvancedSettings,
          },
        },
      },
    });

    updateUser?.(walletAddress, true);
  };

  return (
    <>
      <Heading3
        appearance={{ theme: 'dark' }}
        text={MSG.heading}
        textValues={headingTextValues}
      />
      <Form<FormValues>
        defaultValues={defaultValues}
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
              error={error}
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
