import React from 'react';
import { CloseButtonProps } from 'react-toastify';
import Icon from '~shared/Icon';

const CloseButton = ({ closeToast }: CloseButtonProps) => (
  <button type="button" className="absolute right-5 top-4 h-4 w-4" onClick={closeToast}>
    <Icon appearance={{ size: 'tiny' }} name="close" />
  </button>
);

export default CloseButton;
