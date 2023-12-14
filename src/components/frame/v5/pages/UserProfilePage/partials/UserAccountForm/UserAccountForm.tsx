import React, { FC } from 'react';
import { useMobile } from '~hooks';
import { useSetPageHeadingTitle } from '~context';
import { formatText } from '~utils/intl';
import Button from '~v5/shared/Button';
import Row from '../Row';
import { useUserProfilePageForm } from './hooks';

const displayName = 'v5.pages.UserProfilePage.partials.UserAccountForm';

const UserAccountForm: FC = () => {
  const isMobile = useMobile();
  const { columnsList } = useUserProfilePageForm();

  useSetPageHeadingTitle(formatText({ id: 'userProfile.title' }));

  return (
    <div className="flex flex-col gap-6">
      <h4 className="heading-4">{formatText({ id: 'profile.page' })}</h4>
      <Row groups={columnsList} />
      <div className="flex justify-end">
        <Button type="submit" isFullSize={isMobile} mode="primarySolid">
          {formatText({ id: 'button.saveUserProfile' })}
        </Button>
      </div>
    </div>
  );
};

UserAccountForm.displayName = displayName;

export default UserAccountForm;
