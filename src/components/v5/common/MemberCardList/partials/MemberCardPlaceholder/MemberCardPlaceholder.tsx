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
    <Button size="small" mode="septenary" iconSize="small" {...buttonProps} />
  );

  return (
    <div
      className={clsx(
        styles.wrapper,
        'w-full h-full bg-gray-25 p-5 rounded-lg flex flex-col justify-center items-center text-gray-700 transition-all md:hover:text-gray-900',
      )}
    >
      <p className="text-center text-sm mb-4">{description}</p>
      {buttonTooltipProps ? (
        <Tooltip {...buttonTooltipProps}>{button}</Tooltip>
      ) : (
        button
      )}
    </div>
  );
};

export default MemberCardPlaceholder;
