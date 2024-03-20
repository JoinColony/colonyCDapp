import clsx from 'clsx';
import React, { type FC } from 'react';

import Tooltip from '~shared/Extensions/Tooltip/index.ts';
import Button from '~v5/shared/Button/index.ts';

import { type MemberCardPlaceholderProps } from './types.ts';

import styles from './MemberCardPlaceholder.module.css';

const MemberCardPlaceholder: FC<MemberCardPlaceholderProps> = ({
  description,
  buttonProps,
  buttonTooltipProps,
}) => {
  const button = (
    <Button size="small" mode="septenary" iconSize={18} {...buttonProps} />
  );

  return (
    <div
      className={clsx(
        styles.wrapper,
        'flex h-full w-full flex-col items-center justify-center rounded-lg bg-gray-25 p-5 text-gray-700 transition-all md:hover:text-gray-900',
      )}
    >
      <p className="mb-4 text-center text-sm">{description}</p>
      {buttonTooltipProps ? (
        <Tooltip {...buttonTooltipProps}>{button}</Tooltip>
      ) : (
        button
      )}
    </div>
  );
};

export default MemberCardPlaceholder;
