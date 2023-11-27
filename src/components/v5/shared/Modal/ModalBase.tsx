import React, { FC } from 'react';
import ReactModal from 'react-modal';
import clsx from 'clsx';

import { ModalBaseProps } from './types';
import useDisableBodyScroll from '~hooks/useDisableBodyScroll';

const displayName = 'v5.ModalBase';

const ModalBase: FC<ModalBaseProps> = ({
  role = 'dialog',
  isFullOnMobile,
  isTopSectionWithBackground,
  isOpen,
  ...props
}) => {
  useDisableBodyScroll(isOpen);

  return (
    <ReactModal
      isOpen={isOpen}
      role={role}
      overlayClassName={{
        base: clsx(
          'flex justify-center items-center fixed inset-0 z-[999] bg-base-sprite',
          {
            'py-4': !isFullOnMobile,
          },
        ),
        afterOpen: '',
        beforeClose: 'blur-none',
      }}
      className={clsx(
        `relative outline-0 overflow-auto max-h-full bg-base-white md:h-auto
        md:border md:border-gray-200 md:rounded-xl shadow-default flex flex-col md:w-[30.3125rem]`,
        {
          'w-screen h-full': isFullOnMobile,
          'w-[calc(100vw-3rem)] max-h-[calc(100%-4rem)] border border-gray-200 rounded-xl shadow-default':
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
};

ModalBase.displayName = displayName;

export default ModalBase;
