import { Check } from '@phosphor-icons/react';
import clsx from 'clsx';
import React, { type FC, type PropsWithChildren } from 'react';
import { useIntl } from 'react-intl';

import { type ButtonContentProps } from './types.ts';

const displayName = 'v5.ButtonContent';

const ButtonContent: FC<PropsWithChildren<ButtonContentProps>> = ({
  icon: Icon,
  iconSize,
  isIconRight,
  mode = ' primarySolid',
  text,
  textValues,
  children,
}) => {
  const { formatMessage } = useIntl();

  const buttonText =
    typeof text === 'string' ? text : text && formatMessage(text, textValues);

  return (
    <>
      {mode === 'completed' && (
        <span className="mr-1 flex shrink-0">
          <Check size={iconSize || 12} />
        </span>
      )}
      {Icon && !isIconRight && (
        <span className="flex shrink-0">
          <Icon size={iconSize} />
        </span>
      )}
      {(buttonText || children) && (
        <>
          {Icon ? (
            <span
              className={clsx('flex items-center', {
                'mr-2': isIconRight,
                'ml-1': !isIconRight,
              })}
            >
              {buttonText || children}
            </span>
          ) : (
            buttonText || children
          )}
        </>
      )}
      {Icon && isIconRight && (
        <span className="flex shrink-0">
          <Icon size={iconSize} />
        </span>
      )}
    </>
  );
};

ButtonContent.displayName = displayName;

export default ButtonContent;
