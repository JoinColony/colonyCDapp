import React, { FC, PropsWithChildren } from 'react';

import { IconButtonProps } from './types';

import Icon from '~shared/Icon';
import IconButton from './IconButton';
import { useMobile } from '~hooks';

const displayName = 'v5.Button.CompleteButton';

const CompletedButton: FC<PropsWithChildren<Omit<IconButtonProps, 'icon'>>> = (
  props,
) => {
  const isMobile = useMobile();
  return (
    <IconButton
      {...props}
      title={{ id: 'button.completed' }}
      text={{ id: 'button.completed' }}
      ariaLabel={{ id: 'button.completed' }}
      isFullSize={isMobile}
      icon={
        <span className="flex shrink-0 ml-1.5">
          <Icon
            name="white-tick"
            className="w-[0.8125rem] h-[0.8125rem]"
            appearance={{ size: 'tiny' }}
          />
        </span>
      }
    />
  );
};

CompletedButton.displayName = displayName;

export default CompletedButton;
