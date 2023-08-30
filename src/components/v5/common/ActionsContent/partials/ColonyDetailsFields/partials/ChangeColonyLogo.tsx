import React, { FC, ReactElement, useRef } from 'react';
import { useIntl } from 'react-intl';

import Modal from '~v5/shared/Modal';
import FileUpload from '~v5/common/AvatarUploader/partials/FileUpload';
import ProgressContent from '~v5/common/AvatarUploader/partials/ProgressContent';
import { SpinnerLoader } from '~shared/Preloaders';
import Avatar from '~v5/shared/Avatar';
import { useChangeColonyAvatar } from './hooks';
import { useActionSidebarContext } from '~context/ActionSidebarContext';

const displayName =
  'v5.common.ActionsContent.partials.ColonyDetailsFields.partials.ChangeColonyLogo';

const ChangeColonyLogo: FC = () => {
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

  const getPlaceholder = (
    loading: boolean,
    avatar: ReactElement<
      unknown,
      string | React.JSXElementConstructor<unknown>
    >,
  ) => {
    if (loading) {
      return <SpinnerLoader appearance={{ size: 'medium' }} />;
    }

    return avatar;
  };

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
      <>
        <FileUpload
          dropzoneOptions={{
            disabled: false,
          }}
          handleFileAccept={handleFileAccept}
          handleFileReject={handleFileReject}
          handleFileRemove={handleFileRemove}
          placeholder={getPlaceholder(
            isLoading,
            <Avatar size="xm" avatar={colonyAvatarImage} />,
          )}
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
      </>
    </Modal>
  );
};

ChangeColonyLogo.displayName = displayName;

export default ChangeColonyLogo;
