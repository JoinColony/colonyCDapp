import { Props as ReactModalProps } from 'react-modal';
import React from 'react';

import { ButtonMode } from '../Button/types';

export interface ModalBaseProps extends ReactModalProps {
  isFullOnMobile?: boolean;
  isTopSectionWithBackground?: boolean;
}

export interface ModalProps extends ModalBaseProps {
  onClose: () => void;
  onConfirm?: () => void | Promise<void>;
  title?: React.ReactNode;
  subTitle?: React.ReactNode;
  icon?: string;
  isWarning?: boolean;
  confirmMessage?: string;
  closeMessage?: string;
  disabled?: boolean;
  buttonMode?: ButtonMode;
  isTopSectionWithBackground?: boolean;
}
