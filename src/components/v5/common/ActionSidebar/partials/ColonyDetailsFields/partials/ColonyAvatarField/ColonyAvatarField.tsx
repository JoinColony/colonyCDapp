import { Image } from '@phosphor-icons/react';
import clsx from 'clsx';
import React, { type FC } from 'react';
import { useController } from 'react-hook-form';

import { useAdditionalFormOptionsContext } from '~context/AdditionalFormOptionsContext/AdditionalFormOptionsContext.ts';
import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
import useToggle from '~hooks/useToggle/index.ts';
import SpinnerLoader from '~shared/Preloaders/SpinnerLoader.tsx';
import { formatText } from '~utils/intl.ts';
import { useGetUploaderText } from '~v5/common/AvatarUploader/hooks.ts';
import FileUpload from '~v5/common/AvatarUploader/partials/FileUpload.tsx';
import ColonyAvatar from '~v5/shared/ColonyAvatar/index.ts';
import Modal from '~v5/shared/Modal/index.ts';

import { useChangeColonyAvatar } from './hooks.ts';
import { type ColonyAvatarFieldProps } from './types.ts';

const displayName =
  'v5.common.ActionsContent.partials.ColonyDetailsFields.partials.ColonyAvatarField';

const ColonyAvatarField: FC<ColonyAvatarFieldProps> = ({
  fileOptions,
  name,
  disabled,
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
  const {
    colony: { colonyAddress, name: colonyName },
  } = useColonyContext();

  return (
    <>
      <div className="mr-2 flex shrink-0">
        <ColonyAvatar
          colonyImageSrc={field.value?.image}
          colonyAddress={colonyAddress}
          colonyName={colonyName}
          size={20}
        />
      </div>
      {!readonly && (
        <button
          type="button"
          className={clsx('underline text-3', {
            'text-gray-700 md:hover:text-blue-400': !disabled,
            'text-gray-300': disabled,
          })}
          onClick={() => {
            toggleAvatarModalOn();
            setModalValue(field.value);
          }}
          disabled={disabled}
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
        icon={Image}
        confirmMessage={
          avatarFileError
            ? undefined
            : formatText({
                id: 'button.confirmChange',
              })
        }
        closeMessage={
          avatarFileError ? undefined : formatText({ id: 'button.cancel' })
        }
      >
        <h5 className="mb-1.5 heading-5">
          {formatText({ id: 'editColonyLogo.modal.title' })}
        </h5>
        <p className="mb-6 text-md text-gray-600">
          {formatText({ id: 'editColonyLogo.modal.subtitle' })}
        </p>
        <div className="flex flex-col gap-4 sm:flex-row sm:gap-2">
          <div className="mr-4 flex items-center gap-4 sm:items-start">
            <div className="flex-shrink-0">
              {isLoading ? (
                <SpinnerLoader appearance={{ size: 'medium' }} />
              ) : (
                <ColonyAvatar
                  size={60}
                  colonyImageSrc={modalValue?.image}
                  colonyAddress={colonyAddress}
                  colonyName={colonyName}
                />
              )}
            </div>
            <p className="text-sm text-gray-600 sm:hidden">{uploaderText}</p>
          </div>
          <div className="flex w-full flex-col gap-2">
            <p className="hidden text-sm text-gray-600 sm:block">
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
              isFileUploaded={!!modalValue}
            />
          </div>
        </div>
      </Modal>
    </>
  );
};

ColonyAvatarField.displayName = displayName;

export default ColonyAvatarField;
