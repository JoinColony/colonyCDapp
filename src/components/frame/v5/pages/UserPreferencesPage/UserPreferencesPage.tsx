import React, { FC } from 'react';
import { Navigate } from 'react-router-dom';
import { defineMessages } from 'react-intl';

import { useAppContext, useMobile } from '~hooks';
import Input from '~v5/common/Fields/Input';
import Button from '~v5/shared/Button';
import Icon from '~shared/Icon';
import { useCopyToClipboard } from '~hooks/useCopyToClipboard';
import Switch from '~v5/common/Fields/Switch';
import { multiLineTextEllipsis } from '~utils/strings';
import LoadingTemplate from '~frame/LoadingTemplate';
import { LANDING_PAGE_ROUTE } from '~routes';
import { formatText } from '~utils/intl';

import LeftColumn from '../UserProfilePage/partials/LeftColumn';
import { useUserPreferencesPage } from './hooks';
import { UserPreferencesPageProps } from './types';
import styles from './UserPreferencesPage.module.css';

const displayName = 'v5.pages.UserPreferencesPage';

const MSG = defineMessages({
  loadingText: {
    id: `${displayName}.loadingText`,
    defaultMessage: 'Fetching user preferences',
  },
});

// @TODO: There is a lot of repetition in this file, we should try to refactor
const UserPreferencesPage: FC<UserPreferencesPageProps> = ({
  truncateLimit = 20,
}) => {
  const { user, userLoading, walletConnecting } = useAppContext();
  const isMobile = useMobile();
  const { handleClipboardCopy, isCopied } = useCopyToClipboard(5000);

  const {
    errors,
    handleSubmit,
    onSubmit,
    register,
    getValues,
    isEmailInputVisible,
    setIsEmailInputVisible,
  } = useUserPreferencesPage();

  if (userLoading || walletConnecting) {
    return <LoadingTemplate loadingText={MSG.loadingText} />;
  }

  if (!user) {
    return <Navigate to={LANDING_PAGE_ROUTE} />;
  }

  const emailValue = getValues('email');

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-col gap-6">
        <h4 className="heading-4">
          {formatText({ id: 'userPreferencesPage.accountPreferences' })}
        </h4>
        <div className={styles.row}>
          <LeftColumn
            fieldTitle={{ id: 'field.email' }}
            fieldDescription={{ id: 'description.email' }}
          />
          <div className="w-full flex flex-col">
            {emailValue && !isEmailInputVisible && (
              <div className="flex items-center justify-end">
                <span className="text-md mr-6">{emailValue}</span>
                <Button
                  mode="primarySolid"
                  text={{ id: 'button.updateEmail' }}
                  onClick={() => setIsEmailInputVisible(true)}
                />
              </div>
            )}
            {!emailValue ||
              (isEmailInputVisible && (
                <>
                  <Input
                    name="email"
                    register={register}
                    isError={!!errors.email?.message}
                    customErrorMessage={errors.email?.message}
                  />
                  <div className="ml-auto mt-2">
                    <Button
                      mode="primarySolid"
                      text={{ id: 'button.saveEmail' }}
                      type="submit"
                    />
                  </div>
                </>
              ))}
          </div>
        </div>
        <span className="divider" />
        <div className={styles.row}>
          <div className="flex md:flex-row flex-col items-center justify-between p-3 bg-gray-50 rounded-lg w-full">
            <div className="flex items-center mb-3 md:mb-0">
              <Icon name="cardholder" appearance={{ size: 'small' }} />
              <span className="text-md ml-2 truncate block w-full">
                {isMobile
                  ? multiLineTextEllipsis(user.walletAddress, truncateLimit)
                  : user.walletAddress}
              </span>
            </div>
            <Button
              mode={isCopied ? 'completed' : 'septenary'}
              iconName={isCopied ? '' : 'copy-simple'}
              isFullSize={isMobile}
              onClick={() => handleClipboardCopy(user?.walletAddress || '')}
              text={{
                id: isCopied ? 'copy.addressCopied' : 'copy.address',
              }}
            />
          </div>
        </div>
        <span className="divider" />
        <h5 className="heading-5">
          {formatText({
            id: 'userPreferencesPage.notificationPreferences',
          })}
        </h5>
        <div className={styles.row}>
          <LeftColumn
            fieldTitle={{ id: 'field.discord' }}
            fieldDescription={{ id: 'description.discord' }}
          />
          <Button
            mode="tertiary"
            iconName="discord-logo"
            iconSize="small"
            text={{ id: 'button.connectDiscord' }}
          />
        </div>
        <div className={styles.switchRow}>
          <LeftColumn
            fieldTitle={{ id: 'field.browserNotification' }}
            fieldDescription={{ id: 'description.browserNotification' }}
          />
          <Switch id="browser-notification" />
        </div>
        <div className={styles.switchRow}>
          <LeftColumn
            fieldTitle={{ id: 'field.emailNotification' }}
            fieldDescription={{ id: 'description.emailNotification' }}
          />
          <Switch id="email-notification" />
        </div>
        <span className="divider" />
        <h5 className="heading-5">
          {formatText({
            id: 'userPreferencesPage.notificationFor',
          })}
        </h5>
        <div className={styles.switchRow}>
          <LeftColumn
            fieldTitle={{ id: 'field.mentionsNotification' }}
            fieldDescription={{ id: 'description.mentionsNotification' }}
          />
          <Switch id="mentions" />
        </div>
        <div className={styles.switchRow}>
          <LeftColumn
            fieldTitle={{ id: 'field.disableNotification' }}
            fieldDescription={{ id: 'description.disableNotification' }}
          />
          <Switch id="disable-notifications" />
        </div>
        <span className="divider" />
        <h5 className="heading-5">
          {formatText({
            id: 'userPreferencesPage.displayPreferences',
          })}
        </h5>
        <div className={styles.switchRow}>
          <LeftColumn
            fieldTitle={{ id: 'field.display' }}
            fieldDescription={{ id: 'description.display' }}
          />
          <Switch id="display" />
        </div>
        <span className="divider" />
        <div className={styles.row}>
          <LeftColumn
            fieldTitle={{ id: 'field.switchAccount' }}
            fieldDescription={{ id: 'description.switchAccount' }}
          />
          <Button
            mode="tertiary"
            iconName="user-switch"
            iconSize="small"
            text={{ id: 'button.switchAccount' }}
          />
        </div>
      </div>
    </form>
  );
};

UserPreferencesPage.displayName = displayName;

export default UserPreferencesPage;
