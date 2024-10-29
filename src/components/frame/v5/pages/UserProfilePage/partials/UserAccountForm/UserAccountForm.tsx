import React, { type FC } from 'react';

import { useSetPageHeadingTitle } from '~context/PageHeadingContext/PageHeadingContext.ts';
import { useMobile } from '~hooks/index.ts';
import { formatText } from '~utils/intl.ts';
import { formatMessage } from '~utils/yup/tests/helpers.ts';
import Button from '~v5/shared/Button/index.ts';

import Row from '../Row/index.ts';

import { useUserProfilePageForm } from './hooks.tsx';

const displayName = 'v5.pages.UserProfilePage.partials.UserAccountForm';

const UserAccountForm: FC = () => {
  const isMobile = useMobile();
  const { columnsList } = useUserProfilePageForm();

  useSetPageHeadingTitle(formatText({ id: 'userProfileTab.title' }));

  return (
    <div className="flex flex-col gap-6">
      <h4 className="heading-4">{formatMessage({ id: 'profile.page' })}</h4>
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
