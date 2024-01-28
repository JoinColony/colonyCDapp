import React, { type FC, type PropsWithChildren } from 'react';
import { useIntl } from 'react-intl';

import Icon from '~shared/Icon/index.ts';

import { type ButtonContentProps } from './types.ts';

const displayName = 'v5.ButtonContent';

const ButtonContent: FC<PropsWithChildren<ButtonContentProps>> = ({
  iconName,
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
        <span className="flex shrink-0 mr-2">
          <Icon name="check" appearance={{ size: 'extraTiny' }} />
        </span>
      )}
      {iconName && !isIconRight && (
        <span className="flex shrink-0">
          <Icon name={iconName} appearance={{ size: iconSize }} />
        </span>
      )}
      {(buttonText || children) && (
        <>
          {iconName ? (
            <span className={isIconRight ? 'mr-2' : 'ml-2'}>
              {buttonText || children}
            </span>
          ) : (
            buttonText || children
          )}
        </>
      )}
      {iconName && isIconRight && (
        <span className="flex shrink-0">
          <Icon name={iconName} appearance={{ size: iconSize }} />
        </span>
      )}
    </>
  );
};

ButtonContent.displayName = displayName;

export default ButtonContent;
