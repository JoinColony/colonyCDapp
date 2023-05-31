import React, { FC } from 'react';
import { CloseButtonProps } from 'react-toastify';
import Icon from '~shared/Extensions/Icon';

const displayName = 'Extensions.Toast.partials.CloseButton';

const CloseButton: FC<CloseButtonProps> = ({ closeToast }) => (
  <button
    type="button"
    aria-label="Close toast"
    className="absolute right-5 top-4 h-4 w-4 [&>i>svg]:fill-gray-400"
    onClick={closeToast}
  >
    <Icon appearance={{ size: 'tiny' }} name="close" />
  </button>
);

CloseButton.displayName = displayName;

export default CloseButton;
