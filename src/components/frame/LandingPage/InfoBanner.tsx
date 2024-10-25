import { type Icon } from '@phosphor-icons/react';
import clsx from 'clsx';
import React, { type FC } from 'react';

import LoadingSkeleton from '~common/LoadingSkeleton/LoadingSkeleton.tsx';
import { formatText } from '~utils/intl.ts';

interface LoadingInfoBannerProps {
  containerClassNames: string;
  contentClassNames: string;
}

const LoadingInfoBanner: FC<LoadingInfoBannerProps> = ({
  containerClassNames,
  contentClassNames,
}) => {
  return (
    <div className={clsx(containerClassNames, 'border-gray-200')}>
      <LoadingSkeleton
        isLoading
        className="h-[1.625rem] w-[7.5rem] rounded-3xl"
      />
      <div className={contentClassNames}>
        <LoadingSkeleton className="h-5 w-5 rounded-3xl" isLoading />
        <LoadingSkeleton className="h-[1.75rem] w-[7.5rem] rounded" isLoading />
      </div>
      <div>
        <LoadingSkeleton
          className="mb-[.5625rem] h-[.6875rem] w-full rounded"
          isLoading
        />
        <LoadingSkeleton
          className="h-[.6875rem] w-full max-w-[23.3125rem] rounded"
          isLoading
        />
      </div>
    </div>
  );
};

export interface InfoBannerProps {
  variant?: 'info' | 'success' | 'error';
  icon?: Icon;
  loading?: boolean;
  title: string;
  text: string;
}

const displayName = 'frame.LandingPage';

const InfoBanner = ({
  variant = 'info',
  icon: Icon,
  loading,
  title,
  text,
}: InfoBannerProps) => {
  const containerClassNames = 'rounded-lg border p-6';
  const contentClassNames = 'flex items-center gap-[.375rem] pb-2 pt-3';

  if (loading) {
    return (
      <LoadingInfoBanner
        containerClassNames={containerClassNames}
        contentClassNames={contentClassNames}
      />
    );
  }

  const isInfo = variant === 'info';
  const isSuccess = variant === 'success';
  const isError = variant === 'error';

  return (
    <div
      className={clsx(containerClassNames, {
        'border-blue-400': isInfo,
        'border-success-400': isSuccess,
        'border-negative-400': isError,
      })}
    >
      <span
        className={clsx(
          'rounded-3xl px-3 py-1 font-medium text-blue-400 text-3',
          {
            'bg-blue-100 text-blue-400': isInfo,
            'bg-success-100 text-success-400': isSuccess,
            'bg-negative-100 text-negative-400': isError,
          },
        )}
      >
        {formatText({ id: `landingPage.badge.${variant}` })}
      </span>
      <div className={contentClassNames}>
        {Icon && (
          <Icon
            size={20}
            className={clsx({
              'text-success-400': isSuccess,
              'text-negative-400': isError,
              'text-blue-400': isInfo,
            })}
          />
        )}
        <h1 className="heading-5">{title}</h1>
      </div>
      <p className="text-3">{text}</p>
    </div>
  );
};

InfoBanner.displayName = displayName;

export default InfoBanner;
