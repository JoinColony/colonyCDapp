import clsx from 'clsx';
import React, { type FC, type PropsWithChildren } from 'react';
import { defineMessages } from 'react-intl';

import LoadingSkeleton from '~common/LoadingSkeleton/index.ts';
import { formatMessage } from '~utils/yup/tests/helpers.ts';

const displayName = 'common.Extensions.UserHub.partials.CardHeader';

const MSG = defineMessages({
  max: {
    id: `${displayName}.max`,
    defaultMessage: 'Max',
  },
});

interface CardHeaderProps {
  title: string;
  isFormDisabled: boolean;
  handleSetMax: () => void;
  isLoading: boolean;
}

const CardHeader: FC<PropsWithChildren<CardHeaderProps>> = ({
  title,
  isFormDisabled,
  handleSetMax,
  children,
  isLoading,
}) => {
  return (
    <div className="flex justify-between">
      <LoadingSkeleton
        isLoading={isLoading}
        className="h-[18px] w-[55px] rounded"
      >
        <p
          className={clsx('text-sm', {
            'text-gray-600': !isFormDisabled,
            'text-gray-300': isFormDisabled,
          })}
        >
          {title}
        </p>
      </LoadingSkeleton>
      <div className="flex gap-2 text-sm">
        <div
          className={clsx({
            'text-gray-500': !isFormDisabled,
            'text-gray-300': isFormDisabled,
          })}
        >
          {children}
        </div>
        <LoadingSkeleton isLoading={isLoading} className="h-4 w-[21px] rounded">
          <button
            type="button"
            onClick={handleSetMax}
            className={clsx('font-semibold', {
              'text-blue-400 hover:text-blue-300': !isFormDisabled,
              'text-gray-300': isFormDisabled,
            })}
            disabled={isFormDisabled}
          >
            {formatMessage(MSG.max)}
          </button>
        </LoadingSkeleton>
      </div>
    </div>
  );
};

CardHeader.displayName = displayName;

export default CardHeader;
