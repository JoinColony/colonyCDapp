import { Prohibit } from '@phosphor-icons/react';
import React, { type FC } from 'react';
import { toast } from 'react-toastify';

import { useAppContext } from '~context/AppContext/AppContext.ts';
import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
import { ActionTypes } from '~redux';
import { type CancelExpenditurePayload } from '~redux/types/actions/expenditures.ts';
import Toast from '~shared/Extensions/Toast/index.ts';
import { formatText } from '~utils/intl.ts';
import Button, { ActionButton } from '~v5/shared/Button/index.ts';
import Modal from '~v5/shared/Modal/index.ts';

import { type CancelModalProps } from './types.ts';

const CancelModal: FC<CancelModalProps> = ({
  isOpen,
  onClose,
  expenditure,
  ...rest
}) => {
  const { user } = useAppContext();
  const { colony } = useColonyContext();

  const payload: CancelExpenditurePayload = {
    colonyAddress: colony.colonyAddress,
    expenditure,
    userAddress: user?.walletAddress ?? '',
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} icon={Prohibit} {...rest}>
      <h5 className="mb-2 heading-5">
        {formatText({ id: 'cancelModal.title' })}
      </h5>
      <p className="mb-6 text-md text-gray-600">
        {formatText({ id: 'cancelModal.description' })}
      </p>
      <div className="mt-auto flex flex-col-reverse items-center justify-between gap-3 sm:flex-row">
        <Button mode="primaryOutline" isFullSize onClick={onClose}>
          {formatText({ id: 'cancelModal.cancel' })}
        </Button>
        <div className="flex w-full justify-center">
          <ActionButton
            actionType={ActionTypes.EXPENDITURE_CANCEL}
            type="submit"
            mode="primarySolid"
            isFullSize
            values={payload}
            onSuccess={() => {
              onClose();
              toast.success(
                <Toast
                  type="success"
                  title={{ id: 'cancelModal.toast.title' }}
                  description={{
                    id: 'cancelModal.toast.description',
                  }}
                />,
              );
            }}
          >
            {formatText({ id: 'cancelModal.submit' })}
          </ActionButton>
        </div>
      </div>
    </Modal>
  );
};

export default CancelModal;
