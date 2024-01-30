import React, { type FC, type PropsWithChildren } from 'react';

import { useMobile } from '~hooks/index.ts';

import IconButton from './IconButton.tsx';
import { type IconButtonProps } from './types.ts';

const displayName = 'v5.Button.TxButton';

const TxButton: FC<PropsWithChildren<IconButtonProps>> = ({
  className,
  rounded,
  text,
  icon,
  ...rest
}) => {
  const isMobile = useMobile();
  return (
    <IconButton
      className={className}
      title={{ id: 'button.pending' }}
      text={text}
      ariaLabel={{ id: 'button.pending' }}
      isFullSize={isMobile}
      rounded={rounded}
      icon={icon}
      {...rest}
    />
  );
};

TxButton.displayName = displayName;

export default TxButton;
