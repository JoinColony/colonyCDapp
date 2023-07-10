import React, { FC } from 'react';
import ReactModal from 'react-modal';
import clsx from 'clsx';

import { ModalBaseProps } from './types';
import styles from './Modal.module.css';

const displayName = 'v5.ModalBase';

const ModalBase: FC<ModalBaseProps> = ({
  role = 'dialog',
  isFullOnMobile,
  isTopSectionWithBackground,
  ...props
}) => (
  <ReactModal
    role={role}
    overlayClassName={{
      base: styles.overlay,
      afterOpen: '',
      beforeClose: 'blur-none',
    }}
    className={clsx(
      styles.modal,
      `${
        isFullOnMobile
          ? 'w-[100vw] h-[100vh]'
          : '!w-[calc(100vw-3rem)] max-h-[calc(100vh-4rem)] border border-gray-200 rounded-xl shadow-default'
      }`,
      {
        base: 'z-[4] outline-0',
        'pt-6 pl-6': !isTopSectionWithBackground,
        'pt-0 pl-0': isTopSectionWithBackground,
      },
    )}
    shouldFocusAfterRender
    shouldCloseOnOverlayClick
    shouldCloseOnEsc
    shouldReturnFocusAfterClose
    {...props}
  />
);

ModalBase.displayName = displayName;

export default ModalBase;
