import React, { FC } from 'react';
import { CloseButtonProps } from 'react-toastify';
import Icon from '~shared/Icon';

const displayName = 'Extensions.Toast.partials.CloseButton';

const CloseButton: FC<CloseButtonProps> = ({ closeToast }) => (
  <button
    type="button"
    aria-label="Close toast"
    className="absolute right-6 top-6 flex text-gray-400 transition-all duration-normal hover:text-gray-300"
    onClick={closeToast}
  >
    <Icon appearance={{ size: 'tiny' }} name="close" />
  </button>
);

CloseButton.displayName = displayName;

export default CloseButton;
