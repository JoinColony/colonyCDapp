import React, { useState } from 'react';
import { defineMessages } from 'react-intl';
import { string, object, InferType } from 'yup';

import {
  FieldSet,
  HookForm as Form,
  HookFormInput as Input,
  HookFormTextArea as Textarea,
} from '~shared/Fields';

import { useUpdateUserProfileMutation } from '~gql';
import { User } from '~types';
import { noSpaces } from '~utils/cleave';
import { useAppContext } from '~hooks';

import { UserInfo, SaveForm } from '../UserProfileEdit';

import styles from './UserMainSettings.css';

const displayName = 'common.UserProfileEdit.UserMainSettings';

const MSG = defineMessages({
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
  const [showSnackbar, setShowSnackbar] = useState<boolean>(false);
  const { updateUser } = useAppContext();
  const [editUser, { error }] = useUpdateUserProfileMutation();
  const defaultValues = {
    email: profile?.email || '',
    displayName: profile?.displayName || '',
    bio: profile?.bio || '',
    website: profile?.website || '',
    location: profile?.location || '',
  };

  const handleSubmit = async (updatedProfile: FormValues) => {
    await editUser({
      variables: {
        input: {
          id: walletAddress,
          ...updatedProfile,
          email: updatedProfile.email || null,
        },
      },
    });

    updateUser?.(walletAddress, true);
  };

  return (
    <>
      <UserInfo user={user} />
      <Form<FormValues>
        defaultValues={defaultValues}
        onSubmit={handleSubmit}
        validationSchema={validationSchema}
        resetOnSubmit
      >
        {({ formState: { isDirty, isValid } }) => (
          <div className={styles.main}>
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
            <SaveForm
              dataTest="userSettingsSubmit"
              disabled={!isDirty || !isValid}
              error={error}
              showSnackbar={showSnackbar}
              setShowSnackbar={setShowSnackbar}
            />
          </div>
        )}
      </Form>
    </>
  );
};

UserMainSettings.displayName = displayName;

export default UserMainSettings;
