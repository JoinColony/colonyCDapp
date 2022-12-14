import React, { useEffect, useState } from 'react';
import { defineMessages } from 'react-intl';
import { string, object, InferType } from 'yup';

import Snackbar, { SnackbarType } from '~shared/Snackbar';
import CopyableAddress from '~shared/CopyableAddress';
import UserMention from '~shared/UserMention';
import Heading from '~shared/Heading';
import {
  FieldSet,
  HookForm as Form,
  HookFormInput as Input,
  InputLabel,
  HookFormTextArea as Textarea,
} from '~shared/Fields';
import Button from '~shared/Button';

import { useUpdateUserProfileMutation } from '~gql';
import { User } from '~types';
import { useAppContext } from '~hooks';
import { excludeTypenameKey } from '~utils/objects';
import { noSpaces } from '~utils/cleave';

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
  emailError: {
    id: `${displayName}.emailError`,
    defaultMessage: 'Enter a valid email address',
  },
});

interface Props {
  user: User;
}

const validationSchema = object({
  email: string()
    .default('')
    .email(() => MSG.emailError),
  bio: string().default(''),
  displayName: string().default(''),
  location: string().default(''),
  website: string()
    .default('')
    .url(() => MSG.websiteError),
}).defined();

type FormValues = InferType<typeof validationSchema>;

const UserMainSettings = ({
  user: { walletAddress, profile },
  user,
}: Props) => {
  const { updateUser } = useAppContext();

  const userProfile = excludeTypenameKey(profile);
  const [showSnackbar, setShowSnackbar] = useState<boolean>(false);

  const [editUser, { error, loading, called }] = useUpdateUserProfileMutation();
  const defaultValues = {
    email: profile?.email || '',
    displayName: profile?.displayName || '',
    bio: profile?.bio || '',
    website: profile?.website || '',
    location: profile?.location || '',
  };

  const handleSubmit = (updatedProfile: FormValues) => {
    const valuesToSubmit = {
      email: updatedProfile.email === '' ? null : updatedProfile.email,
    };

    editUser({
      variables: {
        input: {
          id: walletAddress,
          ...userProfile,
          ...updatedProfile,
          ...valuesToSubmit,
        },
      },
    });
  };

  useEffect(() => {
    if (called && !loading && updateUser) {
      updateUser(walletAddress);
      setShowSnackbar(true);
    }
  }, [called, loading, walletAddress, updateUser]);

  return (
    <>
      <Heading
        appearance={{ theme: 'dark', size: 'medium' }}
        text={MSG.heading}
      />
      <Form<FormValues>
        defaultValues={defaultValues}
        onSubmit={handleSubmit}
        validationSchema={validationSchema}
      >
        {({ formState: { isSubmitting, isDirty, isValid } }) => (
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
                formattingOptions={noSpaces}
                value={defaultValues.email}
              />
              <Input
                label={MSG.labelName}
                name="displayName"
                dataTest="userSettingsName"
                showConfusable
              />
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
                formattingOptions={noSpaces}
                value={defaultValues.website}
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
                disabled={!isDirty || !isValid}
              />
            </FieldSet>
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

export default UserMainSettings;
