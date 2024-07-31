import { SpinnerGap } from '@phosphor-icons/react';
import clsx from 'clsx';
import React from 'react';

import Button, { TxButton } from '~v5/shared/Button/index.ts';

import { type ModalFormCTAButtonsProps } from './types.ts';

const displayName =
  'v5.pages.UserCryptoToFiatPage.partials.ModalFormCTAButtons';

const ModalFormCTAButtons: React.FC<ModalFormCTAButtonsProps> = ({
  cancelButton,
  proceedButton,
  className,
  isLoading,
}) => (
  <section className={clsx('flex items-center gap-2', className)}>
    <Button
      type="button"
      text={cancelButton?.title}
      onClick={cancelButton?.onClick}
      mode="primaryOutline"
      className="flex-1"
    />
    {isLoading ? (
      <TxButton
        className="flex-1 !text-md"
        rounded="s"
        text={proceedButton.title}
        icon={
          <span className="ml-1.5 flex shrink-0">
            <SpinnerGap className="animate-spin" size={14} />
          </span>
        }
      />
    ) : (
      <Button text={proceedButton.title} type="submit" className="flex-1" />
    )}
  </section>
);

ModalFormCTAButtons.displayName = displayName;

export default ModalFormCTAButtons;
