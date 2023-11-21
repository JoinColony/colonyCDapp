import React, { FC } from 'react';
import { useIntl } from 'react-intl';

import { SuccessContentProps } from '~v5/common/AvatarUploader/types';
import Button from '~v5/shared/Button';

const displayName = 'v5.common.AvatarUploader.partials.SuccessContent';

const SuccessContent: FC<SuccessContentProps> = ({
  open,
  handleFileRemove,
}) => {
  const { formatMessage } = useIntl();

  return (
    <div className="flex items-center gap-2">
      <Button mode="primarySolid" onClick={open}>
        {formatMessage({ id: 'button.change.avatar' })}
      </Button>
      <Button onClick={handleFileRemove} mode="tertiary">
        {formatMessage({
          id: 'button.delete.avatar',
        })}
      </Button>
    </div>
  );
};

SuccessContent.displayName = displayName;

export default SuccessContent;
