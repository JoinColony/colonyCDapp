import { type Props as ReactModalProps } from 'react-modal';

import { type ButtonMode } from '../Button/types.ts';

import type React from 'react';

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
  shouldShowHeader?: boolean;
}
