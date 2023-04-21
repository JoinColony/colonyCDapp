import React, { FC } from 'react';
import ReactModal from 'react-modal';
import clsx from 'clsx';
import { ModalBaseProps } from './types';
import styles from './Modal.module.css';

const displayName = 'Extensions.ModalBase';

const ModalBase: FC<ModalBaseProps> = ({ role = 'dialog', ...props }) => (
  <ReactModal
    role={role}
    overlayClassName={{
      base: styles.overlay,
      afterOpen: '',
      beforeClose: '',
    }}
    className={clsx(styles.modal, {
      base: 'z-[4] outline-0',
    })}
    shouldFocusAfterRender
    shouldCloseOnOverlayClick
    shouldCloseOnEsc
    shouldReturnFocusAfterClose
    {...props}
  />
);

ModalBase.displayName = displayName;

export default ModalBase;
