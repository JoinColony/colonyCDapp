import React, { useCallback, useEffect, useState } from 'react';
import { defineMessages } from 'react-intl';
import * as yup from 'yup';
import { isConfusing } from '@colony/unicode-confusables-noascii';

import Snackbar, { SnackbarType } from '~shared/Snackbar';
import CopyableAddress from '~shared/CopyableAddress';
import UserMention from '~shared/UserMention';
import Heading from '~shared/Heading';
import {
  FieldSet,
  Form,
  FormStatus,
  Input,
  InputLabel,
  Textarea,
} from '~shared/Fields';
import Button from '~shared/Button';
import ConfusableWarning from '~shared/ConfusableWarning';

import { useUpdateUserMutation } from '~gql';
import { User } from '~types';
import { useAppContext } from '~hooks';

import styles from './UserProfileEdit.css';

const displayName = 'common.UserProfileEdit.UserMainSettings';

const MSG = defineMessages({
  heading: {
    id: `${displayName}.heading`,
    defaultMessage: 'Profile',
  },
  labelWallet: {
    id: `${displayName}.labelWallet`,
    defaultMessage: 'Your Wallet',
  },
  labelUsername: {
    id: `${displayName}.labelUsername`,
    defaultMessage: 'Unique Username',
  },
  labelEmail: {
    id: `${displayName}.labelEmail`,
    defaultMessage: 'Your email',
  },
  labelName: {
    id: `${displayName}.labelName`,
    defaultMessage: 'Your display name',
  },
  labelBio: {
    id: `${displayName}.labelBio`,
    defaultMessage: 'Bio',
  },
  labelWebsite: {
    id: `${displayName}.labelWebsite`,
    defaultMessage: 'Website',
  },
  labelLocation: {
    id: `${displayName}.labelLocation`,
    defaultMessage: 'Location',
  },
  snackbarSuccess: {
    id: `${displayName}.snackbarSuccess`,
    defaultMessage: 'Profile settings have been updated.',
  },
  snackbarError: {
    id: `${displayName}.snackbarError`,
    defaultMessage: 'Profile settings were not able to be updated. Try again.',
  },
  websiteError: {
    id: `${displayName}.websiteError`,
    defaultMessage: 'Enter a valid URL',
  },
});

interface FormValues {
  email?: string;
  displayName?: string;
  bio?: string;
  website?: string;
  location?: string;
}

interface Props {
  user: User;
}

const validationSchema = yup.object({
  email: yup.string().email().nullable(),
  bio: yup.string().nullable(),
  displayName: yup.string().nullable(),
  location: yup.string().nullable(),
  website: yup
    .string()
    .url(() => MSG.websiteError)
    .nullable(),
});

const UserMainSettings = ({
  user: { walletAddress, profile },
  user,
}: Props) => {
  const { updateUser } = useAppContext();

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { __typename, ...userProfile } = profile || {};
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

  const [editUser, { error, loading, called }] = useUpdateUserMutation();
  const onSubmit = useCallback(
    (updatedProfile: FormValues) =>
      editUser({
        variables: {
          input: {
            id: walletAddress,
            profile: { ...userProfile, ...updatedProfile },
          },
        },
      }),
    [walletAddress, editUser, userProfile],
  );

  useEffect(() => {
    if (called && !loading && updateUser) {
      updateUser(walletAddress);
    }
  }, [called, loading, walletAddress, updateUser]);

  return (
    <>
      <Heading
        appearance={{ theme: 'dark', size: 'medium' }}
        text={MSG.heading}
      />
      <Form<FormValues>
        initialValues={{
          email: profile?.email || undefined,
          displayName: profile?.displayName || undefined,
          bio: profile?.bio || undefined,
          website: profile?.website || undefined,
          location: profile?.location || undefined,
        }}
        onSubmit={onSubmit}
        validationSchema={validationSchema}
      >
        {({ status, isSubmitting, dirty, isValid, values }) => (
          <div className={styles.main}>
            <FieldSet>
              <InputLabel label={MSG.labelWallet} />
              <CopyableAddress appearance={{ theme: 'big' }} full>
                {walletAddress}
              </CopyableAddress>
            </FieldSet>
            <div className={styles.usernameContainer}>
              <InputLabel label={MSG.labelUsername} />
              <UserMention
                user={user}
                title={user.name || walletAddress}
                hasLink={false}
                data-test="userProfileUsername"
              />
            </div>
            <FieldSet className={styles.inputFieldSet}>
              <Input
                label={MSG.labelEmail}
                name="email"
                dataTest="userSettingsEmail"
              />
              <Input
                label={MSG.labelName}
                name="displayName"
                dataTest="userSettingsName"
              />
              {values.displayName && isConfusing(values.displayName) && (
                <ConfusableWarning />
              )}
              <Textarea
                label={MSG.labelBio}
                name="bio"
                maxLength={160}
                dataTest="userSettingsBio"
              />
              <Input
                label={MSG.labelWebsite}
                name="website"
                dataTest="userSettingsWebsite"
              />
              <Input
                label={MSG.labelLocation}
                name="location"
                dataTest="userSettingsLocation"
              />
            </FieldSet>
            <FieldSet>
              <Button
                type="submit"
                text={{ id: 'button.save' }}
                loading={isSubmitting}
                dataTest="userSettingsSubmit"
                onClick={() => setShowSnackbar(true)}
                disabled={!dirty || !isValid}
              />
            </FieldSet>
            <FormStatus status={status} />
            <Snackbar
              show={showSnackbar}
              setShow={setShowSnackbar}
              msg={error ? MSG.snackbarError : MSG.snackbarSuccess}
              type={error ? SnackbarType.Error : SnackbarType.Success}
            />
          </div>
        )}
      </Form>
    </>
  );
};

UserMainSettings.displayName = displayName;

export default UserMainSettings;
