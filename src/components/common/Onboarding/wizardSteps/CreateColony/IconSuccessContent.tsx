import clsx from 'clsx';
import React, { FC } from 'react';
import { useIntl, defineMessages } from 'react-intl';

import { profileFileOptions } from '~frame/v5/pages/UserProfilePage/partials/consts.ts';
import { useGetUploaderText } from '~v5/common/AvatarUploader/hooks.tsx';
import { SuccessContentProps } from '~v5/common/AvatarUploader/types.ts';
import Button from '~v5/shared/Button/index.ts';

const displayName = 'v5.common.CreateColonyWizard.IconSuccessContent';

const MSG = defineMessages({
  change: {
    id: `${displayName}.changeLogo`,
    defaultMessage: 'Change logo',
  },
});

const IconSuccessContent: FC<SuccessContentProps> = ({
  open,
  handleFileRemove,
}) => {
  const { formatMessage } = useIntl();
  const uploaderText = useGetUploaderText(profileFileOptions);

  return (
    <div className="flex sm:flex-row flex-col gap-4">
      <div className={clsx('flex items-center sm:items-start gap-4')}>
        <div className="sm:hidden text-gray-600 text-sm">{uploaderText}</div>
      </div>
      <div className="flex flex-col gap-2 w-full">
        <div className="hidden sm:block text-gray-600 text-sm">
          {uploaderText}
        </div>
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
      </div>
    </div>
  );
};

IconSuccessContent.displayName = displayName;

export default IconSuccessContent;
