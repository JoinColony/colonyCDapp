import { Check } from '@phosphor-icons/react';
import clsx from 'clsx';
import React, { type FC, type PropsWithChildren } from 'react';

import { useMobile } from '~hooks/index.ts';

import IconButton from './IconButton.tsx';
import { type IconButtonProps } from './types.ts';

const displayName = 'v5.Button.CompleteButton';

const CompletedButton: FC<PropsWithChildren<Omit<IconButtonProps, 'icon'>>> = ({
  text,
  ...rest
}) => {
  const isMobile = useMobile();
  return (
    <IconButton
      title={{ id: 'button.completed' }}
      text={text}
      ariaLabel={{ id: 'button.completed' }}
      isFullSize={isMobile}
      icon={
        <span
          className={clsx('flex shrink-0', {
            'ml-1.5': !!text,
          })}
        >
          <Check className="text-base-white" size={14} />
        </span>
      }
      {...rest}
    />
  );
};

CompletedButton.displayName = displayName;

export default CompletedButton;
