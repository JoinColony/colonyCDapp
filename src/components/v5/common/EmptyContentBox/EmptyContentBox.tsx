import React, { FC } from 'react';
import clsx from 'clsx';

import Icon from '~shared/Icon';
import { EmptyContentBoxProps } from './types';
import styles from './EmptyContentBox.module.css';

const displayName = 'v5.common.EmptyContentBox';

const EmptyContentBox: FC<EmptyContentBoxProps> = ({
  icon,
  title,
  description,
  onClick,
  buttonText,
  withButtonIcon,
  withBorder,
}) => {
  return (
    <div
      className={clsx(
        'px-4 pb-4 pt-6 flex flex-col justify-center items-center w-full text-center',
        {
          'border border-gray-200 rounded-lg': withBorder,
        },
      )}
    >
      <div className={styles.iconWrapper}>
        <Icon name={icon} appearance={{ size: 'normal' }} />
      </div>
      <h5 className="text-1 mt-5">{title}</h5>
      <p className="mt-2 text-sm font-normal text-gray-600">{description}</p>
      {onClick && buttonText && (
        // @TODO: Change to Button component
        <button type="button" className="mt-4" onClick={onClick}>
          {withButtonIcon && (
            <Icon name="share-network" appearance={{ size: 'normal' }} />
          )}
          {buttonText}
        </button>
      )}
    </div>
  );
};

EmptyContentBox.displayName = displayName;

export default EmptyContentBox;
