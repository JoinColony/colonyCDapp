import { type IconProps } from '@phosphor-icons/react';
import clsx from 'clsx';
import React, {
  type ChangeEventHandler,
  type ComponentType,
  type FC,
} from 'react';

import LoadingSkeleton from '~common/LoadingSkeleton/index.ts';

const displayName = 'common.Extensions.UserHub.partials.CardInput';

interface CardInputProps {
  isFormDisabled: boolean;
  icon: ComponentType<IconProps>;
  symbol: string;
  name: string;
  value: string;
  onChange: ChangeEventHandler<HTMLInputElement>;
  isLoading: boolean;
}

const CardInput: FC<CardInputProps> = ({
  isFormDisabled,
  icon: Icon,
  symbol,
  name,
  value,
  onChange,
  isLoading,
}) => {
  return (
    <div className={clsx('relative flex', { 'pt-2': isLoading })}>
      <LoadingSkeleton isLoading={isLoading} className="h-5 w-[26px] rounded">
        <input
          name={name}
          value={value}
          onChange={onChange}
          className={clsx('w-full pr-16 text-xl outline-none', {
            'bg-transparent text-gray-300': isFormDisabled,
            'text-gray-900': !isFormDisabled,
          })}
          disabled={isFormDisabled}
        />
      </LoadingSkeleton>
      <div
        className={clsx(
          'absolute right-0 top-1 flex items-center gap-1 text-md font-medium',
          {
            'text-gray-300': isFormDisabled,
            'text-gray-900': !isFormDisabled,
          },
        )}
      >
        <LoadingSkeleton
          className="aspect-square w-[18px] rounded-full"
          isLoading={isLoading}
        >
          <Icon size={18} />
        </LoadingSkeleton>
        <LoadingSkeleton className="h-5 w-10 rounded" isLoading={isLoading}>
          <p>{symbol}</p>
        </LoadingSkeleton>
      </div>
    </div>
  );
};

CardInput.displayName = displayName;

export default CardInput;
