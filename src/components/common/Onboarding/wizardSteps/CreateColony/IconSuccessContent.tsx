import clsx from 'clsx';
import React, { type FC } from 'react';
import { useIntl, defineMessages } from 'react-intl';

import { profileFileOptions } from '~frame/v5/pages/UserProfilePage/partials/consts.ts';
import { useGetUploaderText } from '~v5/common/AvatarUploader/hooks.ts';
import { type SuccessContentProps } from '~v5/common/AvatarUploader/types.ts';
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
    <div className="flex flex-col gap-4 sm:flex-row">
      <div className={clsx('flex items-center gap-4 sm:items-start')}>
        <div className="text-sm text-gray-600 sm:hidden">{uploaderText}</div>
      </div>
      <div className="flex w-full flex-col gap-2">
        <div className="hidden text-sm text-gray-600 sm:block">
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
