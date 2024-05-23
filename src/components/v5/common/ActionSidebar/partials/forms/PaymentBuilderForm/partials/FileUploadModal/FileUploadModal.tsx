import { FileCsv } from '@phosphor-icons/react';
import { type ParseResult } from 'papaparse';
import React, { useMemo, type FC } from 'react';

import ExternalLink from '~shared/ExternalLink/ExternalLink.tsx';
import { convertBytes } from '~utils/convertBytes.ts';
import { formatText } from '~utils/intl.ts';
import FileUpload from '~v5/common/AvatarUploader/partials/FileUpload.tsx';
import ProgressContent from '~v5/common/AvatarUploader/partials/ProgressContent.tsx';
import Modal from '~v5/shared/Modal/Modal.tsx';

import { useUploadCSVFile, useCSVFileTemplate } from './hooks.ts';
import { type FileUploadModalProps } from './types.ts';

const FileUploadModal: FC<FileUploadModalProps> = ({
  isOpen,
  isDataEmpty,
  onUpload,
  onClose,
}) => {
  const csvTemplate = useCSVFileTemplate();

  const fileDownloadUrl = useMemo(() => {
    const blob = new Blob([csvTemplate], {
      type: 'text/csv',
    });
    return URL.createObjectURL(blob);
  }, [csvTemplate]);

  const handleFileUpload = (file: ParseResult<unknown>) => {
    onUpload(file);
    onClose();
  };

  const {
    fileError,
    parsedFileValue,
    handleFileAccept,
    handleFileReject,
    handleFileRemove,
    progress,
    file,
  } = useUploadCSVFile(handleFileUpload);

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        onClose();
        handleFileRemove();
      }}
      buttonMode="primarySolid"
      icon={FileCsv}
    >
      <h5 className="mb-2 heading-5">
        {formatText({
          id: 'fileUploadModal.title',
        })}
      </h5>
      <p className="mb-6 text-md text-gray-600">
        {formatText({
          id: 'fileUploadModal.description',
        })}
      </p>
      {!isDataEmpty && !parsedFileValue && !fileError && (
        <div className="mb-4 rounded border border-negative-300 bg-negative-100 p-[1.125rem] text-sm text-negative-400">
          <span className="font-medium">
            {formatText({ id: 'fileUploadModal.warningImportant' })}
          </span>
          {formatText({ id: 'fileUploadModal.warningText' })}
        </div>
      )}
      <div className="mb-2 flex items-center justify-between gap-2">
        <p className="text-1">
          {formatText({ id: 'fileUploadModal.uploadFile' })}
        </p>
        <ExternalLink
          href={fileDownloadUrl}
          download="expenditures_batch.csv"
          className="underline transition-colors text-3 hover:text-blue-400"
        >
          {formatText({ id: 'fileUploadModal.downloadTemplate' })}
        </ExternalLink>
      </div>
      {progress !== 100 && (
        <FileUpload
          dropzoneOptions={{
            disabled: false,
            accept: {
              'text/csv': [],
            },
          }}
          handleFileAccept={handleFileAccept}
          handleFileReject={handleFileReject}
          handleFileRemove={handleFileRemove}
          fileOptions={{
            fileFormat: ['.CSV'],
            fileDimension: '400 rows',
            fileSize: '2MB',
          }}
          errorCode={fileError}
          isAvatarUploaded={!!parsedFileValue}
        />
      )}
      {progress === 100 && (
        <ProgressContent
          progress={progress}
          fileName={file?.name || ''}
          fileSize={convertBytes(file?.size)}
          handleFileRemove={handleFileRemove}
        />
      )}
    </Modal>
  );
};

export default FileUploadModal;
