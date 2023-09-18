import React, { FC, useRef } from 'react';
import { useIntl } from 'react-intl';

import Modal from '~v5/shared/Modal';
import FileUpload from '~v5/common/AvatarUploader/partials/FileUpload';
import ProgressContent from '~v5/common/AvatarUploader/partials/ProgressContent';
import Avatar from '~v5/shared/Avatar';
import { useChangeColonyAvatar } from './hooks';
import { useActionSidebarContext } from '~context/ActionSidebarContext';
import { ChangeColonyLogoProps } from './types';
import { useGetUploaderText } from '~v5/common/AvatarUploader/hooks';
import { getPlaceholder } from '~v5/common/AvatarUploader/utils';

const displayName =
  'v5.common.ActionsContent.partials.ColonyDetailsFields.partials.ChangeColonyLogo';

const ChangeColonyLogo: FC<ChangeColonyLogoProps> = ({ fileOptions }) => {
  const { formatMessage } = useIntl();
  const dropzoneRef = useRef<{ open: () => void }>();
  const {
    isLoading,
    showPropgress,
    avatarFileError,
    file,
    uploadProgress,
    handleFileAccept,
    handleFileReject,
    handleFileRemove,
    colonyAvatarImage,
  } = useChangeColonyAvatar();
  const { isAvatarModalOpened, toggleChangeAvatarModalOff } =
    useActionSidebarContext();
  const uploaderText = useGetUploaderText(fileOptions);

  return (
    <Modal
      isOpen={isAvatarModalOpened}
      onClose={() => {
        toggleChangeAvatarModalOff();
      }}
      onConfirm={() => {
        toggleChangeAvatarModalOff();
      }}
      buttonMode="primarySolid"
      icon="image"
      confirmMessage={formatMessage({
        id: 'button.changeConfirm',
      })}
      closeMessage={formatMessage({ id: 'button.cancel' })}
    >
      <h5 className="heading-5 mb-1.5">
        {formatMessage({ id: 'editColonyLogo.modal.title' })}
      </h5>
      <p className="text-md text-gray-600 mb-6">
        {formatMessage({ id: 'editColonyLogo.modal.subtitle' })}
      </p>
      <div className="flex sm:flex-row flex-col gap-4 sm:gap-2">
        <div className="flex items-center gap-4 sm:items-start mr-4">
          <div className="flex-shrink-0">
            {getPlaceholder(
              isLoading,
              <Avatar size="xm" avatar={colonyAvatarImage} />,
            )}
          </div>
          <p className="sm:hidden text-gray-600 text-sm">{uploaderText}</p>
        </div>
        <div className="flex flex-col gap-2 w-full">
          <p className="hidden sm:block text-gray-600 text-sm">
            {uploaderText}
          </p>
          <FileUpload
            dropzoneOptions={{
              disabled: false,
            }}
            handleFileAccept={handleFileAccept}
            handleFileReject={handleFileReject}
            handleFileRemove={handleFileRemove}
            fileOptions={fileOptions}
            forwardedRef={dropzoneRef}
            errorCode={avatarFileError}
            isAvatarUploaded={colonyAvatarImage !== null}
            isPropgressContentVisible={showPropgress}
          />
          {showPropgress && (
            <ProgressContent
              progress={uploadProgress}
              fileName={file.fileName}
              fileSize={file.fileSize}
              handleFileRemove={handleFileRemove}
            />
          )}
        </div>
      </div>
    </Modal>
  );
};

ChangeColonyLogo.displayName = displayName;

export default ChangeColonyLogo;
