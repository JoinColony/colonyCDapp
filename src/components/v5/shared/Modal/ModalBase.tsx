import clsx from 'clsx';
import React, { type FC } from 'react';
import ReactModal from 'react-modal';

import useDisableBodyScroll from '~hooks/useDisableBodyScroll/index.ts';

import { type ModalBaseProps } from './types.ts';

const displayName = 'v5.ModalBase';

const ModalBase: FC<ModalBaseProps> = ({
  role = 'dialog',
  isFullOnMobile,
  withPadding,
  withPaddingBottom,
  withBorder,
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
          `fixed inset-0 z-top flex flex-col items-center justify-start bg-base-sprite before:h-full before:max-h-[9.688rem] before:content-[''] after:h-full after:max-h-[9.688rem] after:content-['']`,
          {
            'py-4': !isFullOnMobile,
          },
        ),
        afterOpen: '',
        beforeClose: 'blur-none',
      }}
      className={clsx(
        `relative flex max-h-full shrink-0 flex-col overflow-hidden
        bg-base-white shadow-default outline-0 md:h-auto md:w-[30.3125rem] md:rounded-xl md:border md:border-gray-200`,
        {
          'h-full w-screen': isFullOnMobile,
          'max-h-[calc(100%-4rem)] w-[calc(100vw-3rem)] rounded-xl border border-gray-200 shadow-default':
            !isFullOnMobile,
          base: 'z-base outline-0',
          'pl-6 pt-6': withPadding,
          'pl-0 pt-0': !withPadding,
          'pb-6': withPaddingBottom,
          'border-2 border-purple-200': withBorder,
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
