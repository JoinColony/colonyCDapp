import React, { FC } from 'react';
import { useIntl, defineMessages } from 'react-intl';

import { SuccessContentProps } from '~v5/common/AvatarUploader/types';
import Button from '~v5/shared/Button';

const displayName = 'v5.pages.UserProfilePage.AvatarSuccessContent';

const MSG = defineMessages({
  change: {
    id: `${displayName}.changeAvatar`,
    defaultMessage: 'Change Avatar',
  },
});

const IconSuccessContent: FC<SuccessContentProps> = ({
  open,
  handleFileRemove,
}) => {
  const { formatMessage } = useIntl();

  return (
    <div className="flex items-center gap-2">
      <Button mode="primarySolid" onClick={open}>
        {formatMessage(MSG.change)}
      </Button>
      <Button onClick={handleFileRemove} mode="tertiary">
        {formatMessage({
          id: 'button.delete.avatar',
        })}
      </Button>
    </div>
  );
};

IconSuccessContent.displayName = displayName;

export default IconSuccessContent;
