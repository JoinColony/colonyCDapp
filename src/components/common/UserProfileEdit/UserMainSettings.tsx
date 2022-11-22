import React, { useCallback, useEffect, useState } from 'react';
import { defineMessages } from 'react-intl';
import { useMutation, gql } from '@apollo/client';
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

import { updateUser } from '~gql';
import { User } from '~types';
import { useAppContext } from '~hooks';

import styles from './UserProfileEdit.css';

const MSG = defineMessages({
  heading: {
    id: 'users.UserProfileEdit.UserMainSettings.heading',
    defaultMessage: 'Profile',
  },
  labelWallet: {
    id: 'users.UserProfileEdit.UserMainSettings.labelWallet',
    defaultMessage: 'Your Wallet',
  },
  labelUsername: {
    id: 'users.UserProfileEdit.UserMainSettings.labelUsername',
    defaultMessage: 'Unique Username',
  },
  labelEmail: {
    id: 'users.UserProfileEdit.UserMainSettings.labelEmail',
    defaultMessage: 'Your email',
  },
  labelName: {
    id: 'users.UserProfileEdit.UserMainSettings.labelName',
    defaultMessage: 'Your display name',
  },
  labelBio: {
    id: 'users.UserProfileEdit.UserMainSettings.labelBio',
    defaultMessage: 'Bio',
  },
  labelWebsite: {
    id: 'users.UserProfileEdit.UserMainSettings.labelWebsite',
    defaultMessage: 'Website',
  },
  labelLocation: {
    id: 'users.UserProfileEdit.UserMainSettings.labelLocation',
    defaultMessage: 'Location',
  },
  snackbarSuccess: {
    id: 'users.UserProfileEdit.UserMainSettings.snackbarSuccess',
    defaultMessage: 'Profile settings have been updated.',
  },
  snackbarError: {
    id: 'users.UserProfileEdit.UserMainSettings.snackbarError',
    defaultMessage: 'Profile settings were not able to be updated. Try again.',
  },
});

const displayName = 'users.UserProfileEdit.UserMainSettings';

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
  website: yup.string().url().nullable(),
});

const UserMainSettings = ({ user }: Props) => {
  const appContext = useAppContext();

  const { walletAddress, profile } = user;
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

  const [editUser, { error, loading, called }] = useMutation(gql(updateUser));
  const onSubmit = useCallback(
    (updatedProfile: FormValues) =>
      editUser({
        variables: { input: { id: walletAddress, profile: updatedProfile } },
      }),
    [walletAddress, editUser],
  );

  useEffect(() => {
    if (called && !loading && appContext.updateUser) {
      appContext.updateUser(user.walletAddress);
    }
  }, [appContext, called, loading, user]);

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
