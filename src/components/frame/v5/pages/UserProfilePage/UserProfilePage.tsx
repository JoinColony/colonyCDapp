import React, { FC } from 'react';
import { useIntl } from 'react-intl';

import { useMobile } from '~hooks';
import Input from '~v5/common/Fields/Input';
import Navigation from '~v5/common/Navigation';
import TwoColumns from '~v5/frame/TwoColumns';
import Spinner from '~v5/shared/Spinner';
import LeftColumn from './partials/LeftColumn';
import styles from './UserProfilePage.module.css';
import Textarea from '~v5/common/Fields/Textarea';
import Button from '~v5/shared/Button';
import { useUserProfile } from './hooks';
import { MAX_BIO_CHARS, MAX_DISPLAYNAME_CHARS } from './consts';
import AvatarUploader from '~v5/common/AvatarUploader';
import Avatar from '~v5/shared/Avatar';

const displayName = 'v5.pages.UserProfilePage';

const UserProfilePage: FC = () => {
  const isMobile = useMobile();
  const { formatMessage } = useIntl();
  const { register, handleSubmit, onSubmit, errors, avatarUrl } =
    useUserProfile();

  return (
    <Spinner loadingText={{ id: 'loading.userProfilePage' }}>
      <TwoColumns aside={<Navigation pageName="profile" />}>
        <h4 className="heading-4 mb-6">
          {formatMessage({ id: 'profile.page' })}
        </h4>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-6">
            <div className={`${styles.row} mb-3`}>
              <LeftColumn
                fieldTitle={{ id: 'field.username' }}
                fieldDescription={{ id: 'description.username' }}
              />
              <div className="w-full">
                <Input
                  maxCharNumber={MAX_DISPLAYNAME_CHARS}
                  shouldNumberOfCharsBeVisible
                  name="displayName"
                  register={register}
                  isError={!!errors.displayName?.message}
                  customErrorMessage={errors.displayName?.message}
                  successfulMessage={formatMessage({
                    id: 'success.userName',
                  })}
                  isDecoratedError={
                    errors.displayName?.type === 'isUsernameTaken'
                  }
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
                  customErrorMessage="errors.website.message"
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
                {formatMessage({ id: 'button.saveUserProfile' })}
              </Button>
            </div>
          </div>
        </form>
      </TwoColumns>
    </Spinner>
  );
};

UserProfilePage.displayName = displayName;

export default UserProfilePage;
