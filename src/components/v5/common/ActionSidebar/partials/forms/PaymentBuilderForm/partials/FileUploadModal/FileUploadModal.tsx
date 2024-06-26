import { FileCsv } from '@phosphor-icons/react';
import { type ParseResult } from 'papaparse';
import React, { useMemo, type FC } from 'react';

import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
import { useMemberContext } from '~context/MemberContext/MemberContext.ts';
import ExternalLink from '~shared/ExternalLink/ExternalLink.tsx';
import { convertBytes } from '~utils/convertBytes.ts';
import { formatText } from '~utils/intl.ts';
import FileUpload from '~v5/common/AvatarUploader/partials/FileUpload.tsx';
import ProgressContent from '~v5/common/AvatarUploader/partials/ProgressContent.tsx';
import Modal from '~v5/shared/Modal/Modal.tsx';

import { useUploadCSVFile } from './hooks.ts';
import { type FileUploadModalProps } from './types.ts';

const FileUploadModal: FC<FileUploadModalProps> = ({
  isOpen,
  onUpload,
  onClose,
}) => {
  const { totalContributors } = useMemberContext();
  const { colony } = useColonyContext();

  const fileDownloadUrl = useMemo(() => {
    const generatedCSVTemplate = [
      `
Instructions here: https://clny.io/csv

Address Book

Username (for reference),Address (for reference)`,
    ];

    totalContributors.map((contributor) => {
      return generatedCSVTemplate.push(
        `${contributor?.user?.profile?.displayName},${contributor?.contributorAddress}`,
      );
    });

    generatedCSVTemplate.push(
      `
Token List

Symbol (for reference),Token Contract Address (for reference)`,
    );

    colony?.tokens?.items?.map((token) => {
      return generatedCSVTemplate.push(
        `${token?.token?.symbol},${token?.token?.tokenAddress}`,
      );
    });

    generatedCSVTemplate.push(
      `
Payment Details

Username (for reference),Address,Token Symbol (for reference),Token Contract Address,Amount,Claim delay (hours)
Alice,0x0000000000000000000000000000000000000000,SDC,0xaf88d065e77c8cC2239327C5EDb3A432268e5831,200000,24
Bob,0x0000000000000000000000000000000000000000,USDT,0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9,100000,12
Charles,0x0000000000000000000000000000000000000000,DAI,0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1,50000,6
Dillon,0x0000000000000000000000000000000000000000,CLNY,0xD611b29dc327723269Bd1e53Fe987Ee71A24B234,5000,1
Erlich,0x0000000000000000000000000000000000000000,ETH,0x0000000000000000000000000000000000000000,5000,1`,
    );

    // const blob = new Blob([batchPaymentTemplate], { type: 'text/csv' });
    const blob = new Blob([generatedCSVTemplate.join('\n')], {
      type: 'text/csv',
    });
    return URL.createObjectURL(blob);
  }, [totalContributors, colony]);

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
      {file && !parsedFileValue && !fileError && (
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
          className="underline transition-colors text-3"
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
