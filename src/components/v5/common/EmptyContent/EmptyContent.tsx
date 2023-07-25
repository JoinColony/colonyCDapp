import React, { FC } from 'react';
import { useIntl } from 'react-intl';
import clsx from 'clsx';

import Icon from '~shared/Icon';
import styles from './EmptyContent.module.css';
import { EmptyContentProps } from './types';
import Button from '~v5/shared/Button';

const displayName = 'v5.common.EmptyContent';

const EmptyContent: FC<EmptyContentProps> = ({
  icon,
  title,
  description,
  onClick,
  buttonText,
  withBorder,
  withoutButtonIcon = false,
}) => {
  const { formatMessage } = useIntl();
  const titleText = typeof title === 'string' ? title : formatMessage(title);
  const buttonTextFormatted =
    typeof buttonText === 'string'
      ? buttonText
      : buttonText && formatMessage(buttonText);
  const descriptionText =
    typeof description === 'string' ? description : formatMessage(description);

  return (
    <div
      className={clsx(
        'p-4 flex flex-col justify-center items-center w-full text-center',
        {
          'border border-gray-200 rounded-lg': withBorder,
        },
      )}
    >
      <div className="flex flex-col items-center justify-center">
        <div className={styles.emptyContent}>
          <Icon name={icon} appearance={{ size: 'normal' }} />
        </div>
        <h5 className="text-1 mt-3">{titleText}</h5>
        <p className="mt-2 text-sm text-gray-600">{descriptionText}</p>
        {onClick && (
          <Button
            mode="primaryOutline"
            className="mt-4"
            size="small"
            iconName={withoutButtonIcon ? '' : 'share-network'}
            onClick={onClick}
          >
            {buttonTextFormatted}
          </Button>
        )}
      </div>
    </div>
  );
};

EmptyContent.displayName = displayName;

export default EmptyContent;
