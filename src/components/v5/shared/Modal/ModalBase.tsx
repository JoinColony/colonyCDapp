import React, { FC } from 'react';
import ReactModal from 'react-modal';
import clsx from 'clsx';

import { ModalBaseProps } from './types';

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
      base: 'flex justify-center items-center fixed inset-0 z-[999] overflow-hidden bg-base-sprite bg-opacity-[50%]',
      afterOpen: '',
      beforeClose: 'blur-none',
    }}
    className={clsx(
      `relative outline-0 overflow-hidden bg-base-white md:h-auto
      md:border md:border-gray-200 md:rounded-xl shadow-default flex flex-col`,
      {
        'w-screen h-screen': isFullOnMobile,
        'w-[calc(100vw-3rem)] max-h-[calc(100vh-4rem)] border border-gray-200 rounded-xl shadow-default':
          !isFullOnMobile,
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
