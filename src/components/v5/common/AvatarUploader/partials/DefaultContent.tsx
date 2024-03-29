import { CloudArrowUp } from '@phosphor-icons/react';
import clsx from 'clsx';
import React, { type FC } from 'react';
import { useIntl } from 'react-intl';

import { useMobile } from '~hooks/index.ts';

import { useFormatFormats } from '../hooks.ts';
import { type DefaultContentProps } from '../types.ts';

const displayName = 'v5.common.AvatarUploader.partials.DefaultContent';

const DefaultContent: FC<DefaultContentProps> = ({
  open,
  isSimplified,
  isDragAccept,
  fileOptions: { fileFormat, fileDimension, fileSize },
}) => {
  const { formatMessage } = useIntl();
  const isMobile = useMobile();

  const isSimpleOnMobile = isSimplified && isMobile;
  const formattedFormats = useFormatFormats(fileFormat);

  return (
    <div
      className={clsx(
        'flex w-full flex-col items-center rounded border px-6 hover:border-blue-400 hover:bg-blue-100',
        {
          'py-4': !isSimpleOnMobile,
          'py-2': isSimpleOnMobile,
          'border-gray-200 bg-base-white': !isDragAccept,
          'border-blue-400 bg-blue-100': isDragAccept,
        },
      )}
    >
      {isSimpleOnMobile ? (
        <button
          type="button"
          className="flex items-center text-gray-600"
          onClick={open}
        >
          <CloudArrowUp size={18} />
          <span className="ml-2 text-3">
            {formatMessage({ id: 'upload' }, { format: fileFormat })}
          </span>
        </button>
      ) : (
        <>
          <div className="mb-2 h-9 w-9">
            <div className="flex items-start justify-center rounded-full bg-gray-50 p-[0.25rem]">
              <div className="flex items-start justify-center rounded-full bg-gray-200 p-[0.25rem] text-gray-600">
                <CloudArrowUp size={18} />
              </div>
            </div>
          </div>
          <div className="mb-1 text-blue-400 text-2">
            <button
              aria-label={formatMessage({
                id: isMobile ? 'tap.to.upload' : 'click.to.upload',
              })}
              type="button"
              onClick={open}
            >
              {isMobile ? (
                <span>{formatMessage({ id: 'tap.to.upload' })}</span>
              ) : (
                <>
                  {formatMessage({ id: 'click.to.upload' })}{' '}
                  <span className="text-gray-600 text-1">
                    {formatMessage({ id: 'drag.and.drop' })}
                  </span>
                </>
              )}
            </button>
          </div>
          <span className="text-sm text-gray-600">
            {formatMessage(
              { id: 'avatar.uploader.text' },
              {
                format: formattedFormats,
                dimension: fileDimension,
                size: fileSize,
              },
            )}
          </span>
        </>
      )}
    </div>
  );
};

DefaultContent.displayName = displayName;

export default DefaultContent;
