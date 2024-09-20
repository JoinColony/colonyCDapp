import React from 'react';
import { defineMessages } from 'react-intl';

import { usePaymentBuilderContext } from '~context/PaymentBuilderContext/PaymentBuilderContext.ts';
import { formatText } from '~utils/intl.ts';
import Button from '~v5/shared/Button/Button.tsx';

import StepDetailsBlock from '../StepDetailsBlock/StepDetailsBlock.tsx';

const displayName =
  'v5.common.CompletedAction.partials.PaymentBuilder.partials.UninstalledExtensionBox';

const MSG = defineMessages({
  extensionUninstalled: {
    id: `${displayName}.extensionUninstalled`,
    defaultMessage: 'Staged payment extension was uninstalled',
  },
  extensionDescription: {
    id: `${displayName}.extensionDescription`,
    defaultMessage:
      'The extension used to create this action has been uninstalled. We recommend canceling this action.',
  },
  cancelPayment: {
    id: `${displayName}.cancelPayment`,
    defaultMessage: 'Cancel payment',
  },
});

const UninstalledExtensionBox = () => {
  const { toggleOnCancelModal } = usePaymentBuilderContext();

  return (
    <StepDetailsBlock
      text={formatText(MSG.extensionUninstalled)}
      content={
        <>
          <div className="-ml-[1.125rem] -mr-[1.125rem] -mt-[1.125rem] bg-negative-100 p-[1.125rem] text-sm text-negative-400">
            {formatText(MSG.extensionDescription)}
          </div>
          <div className="pt-[1.125rem]">
            <Button onClick={toggleOnCancelModal} isFullSize>
              {formatText(MSG.cancelPayment)}
            </Button>
          </div>
        </>
      }
    />
  );
};

export default UninstalledExtensionBox;
