import React, { FC, PropsWithChildren } from 'react';

import { IconButtonProps } from './types';

import Icon from '~shared/Icon';
import IconButton from './IconButton';
import { useMobile } from '~hooks';
import { useUserTransactionContext } from '~context/UserTransactionContext';

const displayName = 'v5.Button.PendingButton';

const PendingButton: FC<PropsWithChildren<Omit<IconButtonProps, 'icon'>>> = ({
  className,
  rounded,
}) => {
  const isMobile = useMobile();
  const { setIsUserHubOpen } = useUserTransactionContext();
  return (
    <IconButton
      className={className}
      onClick={() => setIsUserHubOpen(true)}
      title={{ id: 'button.pending' }}
      text={{ id: 'button.pending' }}
      ariaLabel={{ id: 'button.pending' }}
      isFullSize={isMobile}
      rounded={rounded}
      icon={
        <span className="flex shrink-0 ml-1.5">
          <Icon
            name="spinner-gap"
            className="w-[0.8125rem] h-[0.8125rem] animate-spin"
            appearance={{ size: 'tiny' }}
          />
        </span>
      }
      data-openhubifclicked // see UserReputation for usage
    />
  );
};

PendingButton.displayName = displayName;

export default PendingButton;
