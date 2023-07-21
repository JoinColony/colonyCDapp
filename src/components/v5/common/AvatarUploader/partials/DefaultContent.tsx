import React, { FC, PropsWithChildren } from 'react';
import { useIntl } from 'react-intl';
import clsx from 'clsx';

import Icon from '~shared/Icon';
import styles from './AvatarUploader.module.css';

const displayName = 'v5.common.AvatarUploader.partials.SuccessContent';

const DefaultContent: FC<PropsWithChildren> = ({ children }) => {
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
      {children}
      <div className="mb-[0.3rem] text-blue-400 text-2">
        {formatMessage({ id: 'click.to.upload' })}{' '}
        <span className="text-gray-600 text-1">
          {formatMessage({ id: 'drag.and.drop' })}
        </span>
      </div>
      <span className={styles.text}>
        {formatMessage({ id: 'avatar.uploader.text' })}
      </span>
    </div>
  );
};

DefaultContent.displayName = displayName;

export default DefaultContent;
