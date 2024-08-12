import { SpinnerGap } from '@phosphor-icons/react';
import clsx from 'clsx';
import React, { type FC } from 'react';
import { type MessageDescriptor } from 'react-intl';

import { useMobile } from '~hooks';
import { formatText } from '~utils/intl.ts';
import Button from '~v5/shared/Button/Button.tsx';
import IconButton from '~v5/shared/Button/IconButton.tsx';

interface ProceedButtonProps {
  text: MessageDescriptor;
  isLoading?: boolean;
}

export const ProceedButton: FC<ProceedButtonProps> = ({ text, isLoading }) => {
  const isMobile = useMobile();

  return isLoading ? (
    <IconButton
      title={text}
      ariaLabel={text}
      isFullSize={isMobile}
      className="flex-1 rounded-md !text-md"
      icon={
        <span
          className={clsx('flex shrink-0', {
            'ml-1.5': !isMobile,
          })}
        >
          <SpinnerGap className="animate-spin" size={18} />
        </span>
      }
    >
      <span>{formatText(text)}</span>
    </IconButton>
  ) : (
    <Button text={text} type="submit" className="flex-1" />
  );
};
