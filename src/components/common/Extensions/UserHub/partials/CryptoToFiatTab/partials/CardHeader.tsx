import clsx from 'clsx';
import React, { type FC, type PropsWithChildren } from 'react';
import { defineMessages } from 'react-intl';

import { formatMessage } from '~utils/yup/tests/helpers.ts';

const displayName = 'common.Extensions.UserHub.partials.CardWrapper';

const MSG = defineMessages({
  max: {
    id: `${displayName}.max`,
    defaultMessage: 'Max',
  },
});

interface CardWrapperProps {
  title: string;
  isFormDisabled: boolean;
  handleSetMax: () => void;
}

const CardWrapper: FC<PropsWithChildren<CardWrapperProps>> = ({
  title,
  isFormDisabled,
  handleSetMax,
  children,
}) => {
  return (
    <div className="flex justify-between">
      <p
        className={clsx('text-sm', {
          'text-gray-600': !isFormDisabled,
          'text-gray-300': isFormDisabled,
        })}
      >
        {title}
      </p>
      <div className="flex gap-2 text-sm">
        <div
          className={clsx({
            'text-gray-500': !isFormDisabled,
            'text-gray-300': isFormDisabled,
          })}
        >
          {children}
        </div>
        <button
          type="button"
          onClick={handleSetMax}
          className={clsx('font-semibold', {
            'text-blue-400': !isFormDisabled,
            'text-gray-300': isFormDisabled,
          })}
          disabled={isFormDisabled}
        >
          {formatMessage(MSG.max)}
        </button>
      </div>
    </div>
  );
};

CardWrapper.displayName = displayName;

export default CardWrapper;
