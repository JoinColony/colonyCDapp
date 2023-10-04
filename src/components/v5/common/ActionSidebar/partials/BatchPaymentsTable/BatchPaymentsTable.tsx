import React, { FC, useRef } from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';
import clsx from 'clsx';

import Button, { TextButton } from '~v5/shared/Button';
import { useBatchPaymentsTableColumns, useGetTableMenuProps } from './hooks';
import { BatchPaymentsTableModel, BatchPaymentsTableProps } from './types';
import { formatText } from '~utils/intl';
import { useMobile } from '~hooks';
import TableWithMeatballMenu from '~v5/common/TableWithMeatballMenu';
import Modal from '~v5/shared/Modal';
import { useActionSidebarContext } from '~context/ActionSidebarContext';
// import FileUpload from '~v5/common/AvatarUploader/partials/FileUpload';
// import ProgressContent from '~v5/common/AvatarUploader/partials/ProgressContent';
// import NotificationBanner from '~common/Extensions/NotificationBanner';
// import { fileOptions } from './consts';

const displayName = 'v5.common.ActionsContent.partials.BatchPaymentsTable';

const BatchPaymentsTable: FC<BatchPaymentsTableProps> = ({ name }) => {
  // const dropzoneRef = useRef<{ open: () => void }>();
  const isMobile = useMobile();
  const fieldArrayMethods = useFieldArray({
    name,
  });
  const data: BatchPaymentsTableModel[] = fieldArrayMethods.fields.map(
    ({ id }) => ({
      key: id,
    }),
  );
  const { getFieldState } = useFormContext();
  const fieldState = getFieldState(name);
  const columns = useBatchPaymentsTableColumns(name);
  const getMenuProps = useGetTableMenuProps(fieldArrayMethods);
  const {
    uploaderModalToggle: [
      isUploaderModalOpen,
      {
        toggleOn: toggleChangeUploaderModalOn,
        toggleOff: toggleChangeUploaderModalOff,
      },
    ],
  } = useActionSidebarContext();

  return (
    <div>
      {!!data.length && (
        <>
          <h5 className="text-2 mb-3 mt-6">
            {formatText({ id: 'actionSidebar.payments' })}
          </h5>
          <TableWithMeatballMenu<BatchPaymentsTableModel>
            className={clsx('mb-6', {
              '!border-negative-400': !!fieldState.error,
            })}
            getRowId={({ key }) => key}
            columns={columns}
            data={data}
            getMenuProps={getMenuProps}
          />
        </>
      )}
      <Button
        mode="primaryOutline"
        iconName="plus"
        size="small"
        isFullSize={isMobile}
        onClick={() => toggleChangeUploaderModalOn()}
      >
        {formatText({ id: 'button.addBatchPayments' })}
      </Button>
      <Modal
        isOpen={isUploaderModalOpen}
        onClose={() => toggleChangeUploaderModalOff()}
        icon="file-csv"
        buttonMode="primarySolid"
        confirmMessage={formatText({ id: 'button.uploadCSVFile' })}
        closeMessage={formatText({
          id: 'button.cancel',
        })}
      >
        <h5 className="heading-5 mb-1.5">
          {formatText({ id: 'batchPayment.fileUploader.modal.title' })}
        </h5>
        <p className="text-md text-gray-600 mb-6">
          {formatText({
            id: 'batchPayment.fileUploader.modal.subtitle',
          })}
        </p>
        <div className="flex sm:flex-row flex-col">
          <div className="flex flex-col gap-2 w-full">
            {/* <FileUpload
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
              fileUploadErrorMessages={{
                invalidFileFormat: 'upload.file.invalid.format.type',
                tooLargeFile: 'upload.csv.file.too.large.error',
              }}
            >
              <NotificationBanner status="error" isAlt className="mb-4">
                {formatText(
                  { id: 'batchPayment.notification.banner.message' },
                  { br: <br />, number: fileOptions.fileEntriesNumber },
                )}
              </NotificationBanner>
              <div className="flex items-center justify-between mb-2">
                <h5 className="text-1">
                  {formatText({ id: 'batchPayment.uploader.header' })}
                </h5>
                <TextButton
                  type="button"
                  mode="underlined"
                  className="text-blue-400"
                  onClick={() => {}}
                >
                  {formatText({ id: 'batchPayment.download.csv.template' })}
                </TextButton>
              </div>
            </FileUpload>
            {showPropgress && (
              <ProgressContent
                progress={uploadProgress}
                fileName={file.fileName}
                fileSize={file.fileSize}
                handleFileRemove={handleFileRemove}
              />
            )} */}
          </div>
        </div>
      </Modal>
    </div>
  );
};

BatchPaymentsTable.displayName = displayName;

export default BatchPaymentsTable;
