import React, { FC } from 'react';
import { useIntl } from 'react-intl';
import { CloseButtonProps } from 'react-toastify';

import { CloseButton as CloseButtonComponent } from '~v5/shared/Button/index.ts';

const displayName = 'Extensions.Toast.partials.CloseButton';

const CloseButton: FC<CloseButtonProps> = ({ closeToast }) => {
  const { formatMessage } = useIntl();

  return (
    <CloseButtonComponent
      aria-label={formatMessage({ id: 'ariaLabel.closeToast' })}
      className="absolute right-2 top-2"
      onClick={closeToast}
    />
  );
};

CloseButton.displayName = displayName;

export default CloseButton;
