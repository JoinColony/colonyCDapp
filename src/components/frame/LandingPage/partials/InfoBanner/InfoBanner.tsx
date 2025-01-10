import { type Icon } from '@phosphor-icons/react';
import clsx from 'clsx';
import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import { tw } from '~utils/css/index.ts';

import LoadingInfoBanner from './LoadingInfoBanner.tsx';

export interface InfoBannerProps {
  variant?: 'info' | 'success' | 'error';
  icon?: Icon;
  loading?: boolean;
  title: string;
  text: string | React.ReactNode;
}

const displayName = 'frame.LandingPage.partials.InfoBanner';

const MSG = defineMessages({
  info: {
    id: `${displayName}.info`,
    defaultMessage: 'Invite only',
  },
  success: {
    id: `${displayName}.success`,
    defaultMessage: 'Congratulations',
  },
  error: {
    id: `${displayName}.error`,
    defaultMessage: 'Invalid code',
  },
});

const InfoBanner = ({
  variant = 'info',
  icon: Icon,
  loading,
  title,
  text,
}: InfoBannerProps) => {
  const containerClassNames = tw`rounded-lg border p-6`;
  const contentClassNames = tw`flex items-center gap-1.5 pb-2 pt-3`;

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
        <FormattedMessage {...MSG[variant]} />
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
      <p className="text-sm font-normal text-gray-700">{text}</p>
    </div>
  );
};

InfoBanner.displayName = displayName;

export default InfoBanner;
