import { type Icon } from '@phosphor-icons/react';
import { type ReactNode } from 'react';
import { type Props as ReactModalProps } from 'react-modal';

import { type ButtonMode } from '../Button/types.ts';

export interface ModalBaseProps extends ReactModalProps {
  isFullOnMobile?: boolean;
  withPadding?: boolean;
  withBorder?: boolean;
}

export interface ModalProps extends ModalBaseProps {
  onClose: () => void;
  onConfirm?: () => void | Promise<void>;
  title?: ReactNode;
  subTitle?: ReactNode;
  icon?: Icon;
  isWarning?: boolean;
  confirmMessage?: string;
  closeMessage?: string;
  disabled?: boolean;
  buttonMode?: ButtonMode;
  withPadding?: boolean;
  withBorder?: boolean;
  shouldShowHeader?: boolean;
}
