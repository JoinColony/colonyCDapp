import clsx from 'clsx';
import React from 'react';

import Button from '~v5/shared/Button/Button.tsx';

import { ProceedButton } from './ProceedButton.tsx';
import { type ModalFormCTAButtonsProps } from './types.ts';

const displayName =
  'v5.pages.UserCryptoToFiatPage.partials.ModalFormCTAButtons';

const ModalFormCTAButtons: React.FC<ModalFormCTAButtonsProps> = ({
  cancelButton,
  proceedButton,
  className,
  isLoading,
}) => {
  return (
    <section className={clsx('flex items-center gap-2', className)}>
      <Button
        type="button"
        text={cancelButton?.title}
        onClick={cancelButton?.onClick}
        mode="primaryOutline"
        className="flex-1"
      />
      <ProceedButton isLoading={isLoading} text={proceedButton.title} />
    </section>
  );
};

ModalFormCTAButtons.displayName = displayName;

export default ModalFormCTAButtons;
