import { type Icon } from '@phosphor-icons/react';
import clsx from 'clsx';
import React from 'react';

import LoadingSkeleton from '~common/LoadingSkeleton/LoadingSkeleton.tsx';
import { formatText } from '~utils/intl.ts';

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
  return (
    <div
      className={clsx('rounded-lg border p-6', {
        'border-gray-200': loading,
        'border-blue-400': variant === 'info' && !loading,
        'border-success-400': variant === 'success' && !loading,
        'border-negative-400': variant === 'error' && !loading,
      })}
    >
      <LoadingSkeleton
        isLoading={loading}
        className="h-[1.625rem] w-[7.5rem] rounded-3xl"
      >
        <span
          className={clsx(
            'rounded-3xl px-3 py-1 font-medium text-blue-400 text-3',
            {
              'text-blue-400': variant === 'info',
              'text-success-400': variant === 'success',
              'text-negative-400': variant === 'error',
              'bg-blue-100': variant === 'info',
              'bg-success-100': variant === 'success',
              'bg-negative-100': variant === 'error',
            },
          )}
        >
          {formatText({ id: `landingPage.badge.${variant}` })}
        </span>
      </LoadingSkeleton>
      <div className="flex items-center gap-[.375rem] pb-2 pt-3">
        <LoadingSkeleton className="h-5 w-5 rounded-3xl" isLoading={loading}>
          {Icon && (
            <Icon
              size={20}
              className={clsx({
                'text-success-400': variant === 'success',
                'text-negative-400': variant === 'error',
                'text-blue-400': variant === 'info',
              })}
            />
          )}
        </LoadingSkeleton>
        <LoadingSkeleton
          className="h-[1.75rem] w-[7.5rem] rounded"
          isLoading={loading}
        >
          <h1 className="heading-5">{title}</h1>
        </LoadingSkeleton>
      </div>
      {loading ? (
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
      ) : (
        <p className="text-3">{text}</p>
      )}
    </div>
  );
};

InfoBanner.displayName = displayName;

export default InfoBanner;
