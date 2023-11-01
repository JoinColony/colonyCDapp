import React, { FC } from 'react';
import { useIntl } from 'react-intl';

import { PopoverButtonProps } from './types';
import Button from '~v5/shared/Button';

const displayName = 'Extensions.PopoverButton';

const PopoverButton: FC<PopoverButtonProps> = ({
  isDisabled,
  type,
  isFullSize,
}) => {
  const { formatMessage } = useIntl();
  const iconName =
    (type === 'view' && 'eye') ||
    (type === 'deposit' && 'arrow-circle-down-right') ||
    'arrow-circle-up-right';

  const typeText =
    typeof type === 'string' ? type : type && formatMessage(type);

  return (
    <Button
      mode="primaryOutline"
      size="extraSmall"
      aria-label={formatMessage({ id: 'ariaLabel.showDetails' })}
      disabled={isDisabled}
      iconName={iconName}
      iconSize="extraTiny"
      isFullSize={isFullSize}
    >
      {typeText}
    </Button>
  );
};

PopoverButton.displayName = displayName;

export default PopoverButton;
