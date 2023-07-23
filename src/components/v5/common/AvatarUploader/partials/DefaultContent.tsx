import React, { FC } from 'react';
import { useIntl } from 'react-intl';
import clsx from 'clsx';

import Icon from '~shared/Icon';
import styles from './AvatarUploader.module.css';
import { DefaultContentProps } from '../types';

const displayName = 'v5.common.AvatarUploader.partials.SuccessContent';

const DefaultContent: FC<DefaultContentProps> = ({ open }) => {
  const { formatMessage } = useIntl();

  return (
    <div
      className={clsx(
        'flex-col items-center bg-white-100 border-gray-200',
        styles.contentWrapper,
      )}
    >
      <div className="w-[2.55rem] mb-[0.5rem]">
        <div className="bg-gray-50 p-[0.4rem] rounded-full flex items-start justify-center">
          <div className="p-[0.3rem] bg-gray-200 rounded-full flex justify-center text-gray-600">
            <Icon name="cloud-arrow-up" appearance={{ size: 'small' }} />
          </div>
        </div>
      </div>
      <div className="mb-[0.3rem] text-blue-400 text-2">
        <button
          aria-label={formatMessage({ id: 'click.to.upload' })}
          type="button"
          onClick={open}
        >
          {formatMessage({ id: 'click.to.upload' })}{' '}
          <span className="text-gray-600 text-1">
            {formatMessage({ id: 'drag.and.drop' })}
          </span>
        </button>
      </div>
      <span className={styles.text}>
        {formatMessage({ id: 'avatar.uploader.text' })}
      </span>
    </div>
  );
};

DefaultContent.displayName = displayName;

export default DefaultContent;
