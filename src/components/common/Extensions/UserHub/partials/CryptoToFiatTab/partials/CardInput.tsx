import { type IconProps } from '@phosphor-icons/react';
import clsx from 'clsx';
import React, {
  type ChangeEventHandler,
  type ComponentType,
  type FC,
} from 'react';

const displayName = 'common.Extensions.UserHub.partials.CardInput';

interface CardInputProps {
  isFormDisabled: boolean;
  icon: ComponentType<IconProps>;
  symbol: string;
  name: string;
  value: string;
  onChange: ChangeEventHandler<HTMLInputElement>;
}

const CardInput: FC<CardInputProps> = ({
  isFormDisabled,
  icon: Icon,
  symbol,
  name,
  value,
  onChange,
}) => {
  return (
    <div className="relative flex">
      <input
        name={name}
        value={value}
        onChange={onChange}
        className={clsx('w-full pr-16 text-xl outline-none', {
          'bg-transparent text-gray-300': isFormDisabled,
          'bg-base-white text-gray-900': !isFormDisabled,
        })}
        disabled={isFormDisabled}
      />
      <div
        className={clsx(
          'absolute right-0 top-1 flex items-center gap-1 text-md font-medium',
          {
            'text-gray-300': isFormDisabled,
            'text-gray-900': !isFormDisabled,
          },
        )}
      >
        <Icon size={18} />
        <p>{symbol}</p>
      </div>
    </div>
  );
};

CardInput.displayName = displayName;

export default CardInput;
