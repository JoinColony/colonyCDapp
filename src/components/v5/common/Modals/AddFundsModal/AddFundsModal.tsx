import { PiggyBank } from '@phosphor-icons/react';
import React, { type FC } from 'react';

import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
import useCopyToClipboard from '~hooks/useCopyToClipboard.ts';
import { ActionTypes } from '~redux';
import { ActionForm } from '~shared/Fields/index.ts';
import { formatText } from '~utils/intl.ts';
import CopyWallet from '~v5/shared/CopyWallet/CopyWallet.tsx';
import Modal from '~v5/shared/Modal/Modal.tsx';

interface AddFundsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddFundsModal: FC<AddFundsModalProps> = ({ isOpen, onClose }) => {
  const { handleClipboardCopy, isCopied } = useCopyToClipboard();
  const {
    colony: { colonyAddress },
  } = useColonyContext();

  return (
    <Modal icon={PiggyBank} onClose={onClose} isOpen={isOpen}>
      <ActionForm
        actionType={ActionTypes.USER_DEPOSIT_TOKEN}
        onSuccess={(_, { reset }) => {
          reset();
          onClose();
        }}
      >
        <>
          <h5 className="mb-1.5 heading-5">
            {formatText({ id: 'balancePage.modal.title' })}
          </h5>
          <p className="mb-6 text-md text-gray-600">
            {formatText({ id: 'balancePage.modal.subtitle' })}
          </p>
          <CopyWallet
            isCopied={isCopied}
            handleClipboardCopy={() => handleClipboardCopy(colonyAddress || '')}
            value={colonyAddress || ''}
          />
          {/* @TODO: uncomment this when API to create "add funds action" will be ready */}
          {/* <h4 className="text-1 mb-1.5">
              {formatText({ id: 'balanceModal.modal.addFundsToWallet' })}
            </h4>
            <div className="flex items-center justify-between gap-2 mb-1">
              <p className="text-1">
                {formatText({
                  id: 'balanceModal.modal.addFundsToWallet.label',
                })}
              </p>
            </div>
            <FormFormattedInput
              name="amount"
              placeholder="0"
              options={{
                numeralDecimalScale: undefined,
                numeralPositiveOnly: true,
                rawValueTrimPrefix: true,
                tailPrefix: true,
              }}
              buttonProps={{
                label: formatText({ id: 'button.max' }) || '',
                onClick: () => {
                  setValue('amount', {
                    shouldTouch: true,
                    shouldValidate: true,
                    shouldDirty: true,
                  });
                },
              }}
              wrapperClassName="mb-8"
            />

            <div className="flex flex-col-reverse gap-3 sm:flex-row">
              <Button
                mode="primaryOutline"
                onClick={onClose}
                text={formatText({ id: 'button.cancel' })}
                isFullSize
              />
              <Button
                mode="primarySolid"
                type="submit"
                text={formatText({ id: 'button.addFunds' })}
                isFullSize
              />
            </div> */}
        </>
      </ActionForm>
    </Modal>
  );
};
