import React, { FC } from 'react';
import { useIntl } from 'react-intl';

import Button, { TextButton } from '~v5/shared/Button';
import { SuccessContentProps } from '../types';

const displayName = 'v5.pages.UserProfilePage.partials.SuccessContent';

const SuccessContent: FC<SuccessContentProps> = ({
  open,
  handleFileRemove,
}) => {
  const { formatMessage } = useIntl();

  return (
    <div className="flex items-center gap-4">
      <Button mode="primarySolid" onClick={open}>
        {formatMessage({ id: 'button.change.avatar' })}
      </Button>
      <TextButton onClick={handleFileRemove} mode="underlined">
        {formatMessage({
          id: 'button.delete.avatar',
        })}
      </TextButton>
    </div>
  );
};

SuccessContent.displayName = displayName;

export default SuccessContent;
