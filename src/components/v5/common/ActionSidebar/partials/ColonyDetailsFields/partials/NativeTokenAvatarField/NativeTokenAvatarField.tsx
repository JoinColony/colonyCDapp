import React, { FC } from 'react';
import { useController } from 'react-hook-form';

import { ADDRESS_ZERO } from '~constants';
import { useAdditionalFormOptionsContext } from '~context/AdditionalFormOptionsContext/AdditionalFormOptionsContext';
import { useColonyContext } from '~hooks';
import useToggle from '~hooks/useToggle';
import { formatText } from '~utils/intl';
import { useGetUploaderText } from '~v5/common/AvatarUploader/hooks';
import FileUpload from '~v5/common/AvatarUploader/partials/FileUpload';
import { getPlaceholder } from '~v5/common/AvatarUploader/utils';
import Avatar from '~v5/shared/Avatar';
import ColonyAvatar from '~v5/shared/ColonyAvatar';
import Modal from '~v5/shared/Modal';

import { useChangeColonyAvatar } from './hooks';
import { ColonyAvatarFieldProps } from './types';

const displayName =
  'v5.common.ActionsContent.partials.ColonyDetailsFields.partials.NativeTokenAvatarField';

const NativeTokenAvatarField: FC<ColonyAvatarFieldProps> = ({
  fileOptions,
  name,
}) => {
  const { field } = useController({ name });
  const {
    isLoading,
    avatarFileError,
    modalValue,
    setModalValue,
    handleFileAccept,
    handleFileReject,
    handleFileRemove,
  } = useChangeColonyAvatar();
  const { readonly } = useAdditionalFormOptionsContext();
  const [
    isAvatarModalOpened,
    { toggleOff: toggleAvatarModalOff, toggleOn: toggleAvatarModalOn },
  ] = useToggle();
  const uploaderText = useGetUploaderText(fileOptions);
  const { colony } = useColonyContext();
  const { nativeToken } = colony || {};

  return (
    <>
      <div className="flex mr-2 shrink-0">
        <Avatar
          avatar={field.value?.image}
          placeholderIcon="at-sign-circle"
          seed={
            nativeToken?.tokenAddress && nativeToken.tokenAddress.toLowerCase()
          }
          title={nativeToken?.name}
          size="xs"
        />
      </div>
      {!readonly && (
        <button
          type="button"
          className="text-3 underline text-gray-700 hover:text-blue-400"
          onClick={() => {
            toggleAvatarModalOn();
            setModalValue(field.value);
          }}
        >
          Change logo
        </button>
      )}

      <Modal
        isOpen={isAvatarModalOpened}
        onClose={toggleAvatarModalOff}
        onConfirm={() => {
          field.onChange(modalValue);
        }}
        buttonMode="primarySolid"
        icon="image"
        confirmMessage={formatText({
          id: 'button.changeConfirm',
        })}
        closeMessage={formatText({ id: 'button.cancel' })}
      >
        <h5 className="heading-5 mb-1.5">
          {formatText({ id: 'editColonyLogo.modal.title' })}
        </h5>
        <p className="text-md text-gray-600 mb-6">
          {formatText({ id: 'editColonyLogo.modal.subtitle' })}
        </p>
        <div className="flex sm:flex-row flex-col gap-4 sm:gap-2">
          <div className="flex items-center gap-4 sm:items-start mr-4">
            <div className="flex-shrink-0">
              {getPlaceholder(
                isLoading,
                <ColonyAvatar
                  size="xm"
                  colonyImageProps={{
                    src: modalValue?.image,
                  }}
                  colonyAddress={colony?.colonyAddress || ADDRESS_ZERO}
                />,
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
              errorCode={avatarFileError}
              isAvatarUploaded={!!modalValue}
            />
          </div>
        </div>
      </Modal>
    </>
  );
};

NativeTokenAvatarField.displayName = displayName;

export default NativeTokenAvatarField;
