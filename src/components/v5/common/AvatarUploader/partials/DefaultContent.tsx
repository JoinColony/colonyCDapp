import React, { FC } from 'react';
import { useIntl } from 'react-intl';
import clsx from 'clsx';

import Icon from '~shared/Icon';
import styles from './AvatarUploader.module.css';
import { DefaultContentProps } from '../types';
import { useMobile } from '~hooks';

const displayName = 'v5.common.AvatarUploader.partials.DefaultContent';

const DefaultContent: FC<DefaultContentProps> = ({ open }) => {
  const { formatMessage } = useIntl();
  const isMobile = useMobile();

  return (
    <div
      className={clsx(
        'flex-col items-center bg-white-100 border-gray-200',
        styles.contentWrapper,
      )}
    >
      <div className={styles.iconWrapper}>
        <div className={`bg-gray-50 w-9 h-9 ${styles.iconCircle}`}>
          <div
            className={`bg-gray-200 text-gray-600 w-7 h-7 ${styles.iconCircle}`}
          >
            <Icon name="cloud-arrow-up" appearance={{ size: 'small' }} />
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
      <span className={styles.text}>
        {formatMessage({ id: 'avatar.uploader.text' })}
      </span>
    </div>
  );
};

DefaultContent.displayName = displayName;

export default DefaultContent;
