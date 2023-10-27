import React, { FC } from 'react';
import clsx from 'clsx';

import { useAppContext, useMobile } from '~hooks';
import Input from '~v5/common/Fields/Input';
import styles from './UserProfilePage.module.css';
import Textarea from '~v5/common/Fields/Textarea';
import Button from '~v5/shared/Button';
import AvatarUploader from '~v5/common/AvatarUploader';
import Avatar from '~v5/shared/Avatar';
import { formatText } from '~utils/intl';
import { Form } from '~shared/Fields';

import { MAX_BIO_CHARS, MAX_DISPLAYNAME_CHARS } from './consts';
import { useUserProfile } from './hooks';
import LeftColumn from './partials/LeftColumn';
import { FormValues, validationSchema } from './validation';

const displayName = 'v5.pages.UserProfilePage';

const UserProfilePage: FC = () => {
  const isMobile = useMobile();
  const { user } = useAppContext();

  const { handleSubmit, avatarUrl, canChangeUsername, daysTillUsernameChange } =
    useUserProfile();

  return (
    <Form<FormValues>
      onSubmit={handleSubmit}
      validationSchema={validationSchema}
      defaultValues={{
        hasDisplayNameChanged: false,
        bio: user?.profile?.bio || '',
        displayName: user?.profile?.displayName || '',
        location: user?.profile?.location || '',
        website: user?.profile?.website || '',
      }}
      resetOnSubmit
    >
      {({
        formState: { dirtyFields, errors },
        register,
        setValue,
        getValues,
      }) => {
        const { displayName: displayNameDirty } = dirtyFields;
        const showNameMessage =
          displayNameDirty && !errors.displayName?.message;

        /*
         * Imperatively update the hasDisplayNameChanged form field, in order to be able to conditionally
         * validate the displayName field. We don't want it to be validated if it hasn't changed.
         */
        const hasDisplayNameChanged = getValues('hasDisplayNameChanged');

        if (displayNameDirty && !hasDisplayNameChanged) {
          setValue('hasDisplayNameChanged', true, {
            shouldValidate: false,
          });
        } else if (!displayNameDirty && hasDisplayNameChanged) {
          setValue('hasDisplayNameChanged', false, {
            shouldValidate: false,
          });
        }
        return (
          <div className="flex flex-col gap-6">
            <h4 className="heading-4 mb-6">
              {formatText({ id: 'profile.page' })}
            </h4>
            <div className={`${styles.row} mb-3`}>
              <LeftColumn
                fieldTitle={{ id: 'field.username' }}
                fieldDescription={{ id: 'description.username' }}
              />
              <div
                className={clsx('w-full', {
                  'mb-6': showNameMessage,
                })}
              >
                <Input
                  maxCharNumber={MAX_DISPLAYNAME_CHARS}
                  shouldNumberOfCharsBeVisible
                  name="displayName"
                  isDisabled={!canChangeUsername}
                  register={register}
                  isError={!!errors.displayName?.message}
                  customErrorMessage={errors.displayName?.message}
                  successfulMessage={
                    showNameMessage
                      ? formatText({
                          id: 'success.userName',
                        })
                      : undefined
                  }
                  isDecoratedError={
                    errors.displayName?.type === 'isUsernameTaken'
                  }
                  disabledTooltipMessage={formatText(
                    { id: 'displayName.input.disabled' },
                    { days: daysTillUsernameChange },
                  )}
                />
              </div>
            </div>
            <div className={styles.row}>
              <LeftColumn
                fieldTitle={{ id: 'field.avatar' }}
                fieldDescription={{ id: 'description.avatar' }}
              />
              <div className="w-full">
                <AvatarUploader
                  avatarPlaceholder={<Avatar size="xm" avatar={avatarUrl} />}
                  fileOptions={{
                    fileFormat: ['.PNG', '.JPG', '.SVG'],
                    fileDimension: '250x250px',
                    fileSize: '1MB',
                  }}
                />
              </div>
            </div>

            <span className="divider" />

            <div className={styles.row}>
              <LeftColumn
                fieldTitle={{ id: 'field.website' }}
                fieldDescription={{ id: 'description.website' }}
              />
              <div className="w-full">
                <Input
                  name="website"
                  register={register}
                  isError={!!errors.website?.message}
                  customErrorMessage={errors.website?.message}
                />
              </div>
            </div>

            <span className="divider" />

            <div className={styles.row}>
              <LeftColumn
                fieldTitle={{ id: 'field.bio' }}
                fieldDescription={{ id: 'description.bio' }}
              />
              <div className="w-full">
                <Textarea
                  maxCharNumber={MAX_BIO_CHARS}
                  shouldNumberOfCharsBeVisible
                  name="bio"
                  register={register}
                  isError={!!errors.bio?.message}
                />
              </div>
            </div>

            <span className="divider" />

            <div className={styles.row}>
              <LeftColumn
                fieldTitle={{ id: 'field.location' }}
                fieldDescription={{ id: 'description.location' }}
              />
              <div className="w-full">
                <Input name="location" register={register} />
              </div>
            </div>
            <div className="flex justify-end">
              <Button type="submit" isFullSize={isMobile} mode="primarySolid">
                {formatText({ id: 'button.saveUserProfile' })}
              </Button>
            </div>
          </div>
        );
      }}
    </Form>
  );
};

UserProfilePage.displayName = displayName;

export default UserProfilePage;
