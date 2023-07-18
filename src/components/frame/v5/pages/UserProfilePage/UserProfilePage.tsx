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
import FormError from '~v5/shared/FormError';

const displayName = 'v5.pages.UserProfilePage';

const UserProfilePage: FC = () => {
  const isMobile = useMobile();
  const { formatMessage } = useIntl();
  const { register, handleSubmit, onSubmit, errors } = useUserProfile();

  return (
    <Spinner loadingText={{ id: 'loading.userProfilePage' }}>
      <TwoColumns aside={<Navigation pageName="profile" />}>
        <h4 className="heading-4 mb-6">
          {formatMessage({ id: 'profile.page' })}
        </h4>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-6">
            <div className={styles.row}>
              <LeftColumn
                fieldTitle={{ id: 'field.username' }}
                fieldDecription={{ id: 'description.username' }}
              />
              <div className="w-full">
                <Input
                  maxCharNumber={30}
                  shouldNumberOfCharsBeVisible
                  name="displayName"
                  register={register}
                />
              </div>
            </div>
            <div className={styles.row}>
              <LeftColumn
                fieldTitle={{ id: 'field.avatar' }}
                fieldDecription={{ id: 'description.avatar' }}
              />
            </div>

            <div className="w-full h-px bg-gray-200" />

            <div className={styles.row}>
              <LeftColumn
                fieldTitle={{ id: 'field.website' }}
                fieldDecription={{ id: 'description.website' }}
              />
              <div className="flex w-full flex-col">
                <Input name="website" register={register} />
                {errors.website && (
                  <FormError isFullSize alignment="left">
                    {errors.website.message}
                  </FormError>
                )}
              </div>
            </div>

            <div className="w-full h-px bg-gray-200" />

            <div className={styles.row}>
              <LeftColumn
                fieldTitle={{ id: 'field.bio' }}
                fieldDecription={{ id: 'description.bio' }}
              />
              <div className="w-full">
                <Textarea
                  maxCharNumber={200}
                  shouldNumberOfCharsBeVisible
                  name="bio"
                  register={register}
                />
              </div>
            </div>

            <div className="w-full h-px bg-gray-200" />

            <div className={styles.row}>
              <LeftColumn
                fieldTitle={{ id: 'field.location' }}
                fieldDecription={{ id: 'description.location' }}
              />
              <div className="w-full">
                <Input name="location" register={register} />
              </div>
            </div>
            <div className="flex justify-end">
              <Button type="submit" isFullSize={isMobile} mode="primarySolid">
                {formatMessage({ id: 'button.save.user.profile' })}
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
