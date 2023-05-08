import React, { FC } from 'react';
import ReactModal from 'react-modal';
import clsx from 'clsx';
import { ModalBaseProps } from './types';
import styles from './Modal.module.css';

const displayName = 'Extensions.ModalBase';

const ModalBase: FC<ModalBaseProps> = ({ role = 'dialog', isFullOnMobile, ...props }) => (
  <ReactModal
    role={role}
    overlayClassName={{
      base: styles.overlay,
      afterOpen: '',
      beforeClose: '',
    }}
    className={clsx(
      styles.modal,
      `${
        isFullOnMobile
          ? 'w-[100vw] h-[100vh]'
          : `w-[calc(100vw-3rem)] max-h-[calc(100vh-4rem)] border border-gray-200 rounded-xl shadow-default`
      }`,
      {
        base: 'z-[4] outline-0',
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
