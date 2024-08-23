import { WarningCircle } from '@phosphor-icons/react';
import React, { useCallback, type FC } from 'react';
import { useDispatch } from 'react-redux';

import { useAppContext } from '~context/AppContext/AppContext.ts';
import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
import { removeDecisionAction } from '~redux/actionCreators/index.ts';
import { formatText } from '~utils/intl.ts';
import Button from '~v5/shared/Button/Button.tsx';
import CloseButton from '~v5/shared/Button/CloseButton.tsx';
import ModalBase from '~v5/shared/Modal/ModalBase.tsx';

import { type RemoveDraftModalProps } from './types.ts';

const RemoveDraftModal: FC<RemoveDraftModalProps> = ({
  isOpen,
  onCreateNewClick,
  onViewDraftClick,
  onCloseClick,
}) => {
  const { colony } = useColonyContext();
  const { user } = useAppContext();

  const dispatch = useDispatch();

  const handleRemoveDecisionFromLocalStorage = useCallback(
    (walletAddress: string, colonyAddress: string) => {
      dispatch(removeDecisionAction(walletAddress, colonyAddress));
    },
    [dispatch],
  );

  if (!user?.walletAddress) {
    return null;
  }

  return (
    <ModalBase isOpen={isOpen} isFullOnMobile hasPadding>
      <span className="mb-4 flex h-[2.5rem] w-[2.5rem] flex-shrink-0 items-center justify-center rounded border border-gray-200 shadow-content">
        <WarningCircle size={24} />
      </span>
      <CloseButton
        aria-label={formatText({ id: 'ariaLabel.closeModal' })}
        title={formatText({ id: 'button.cancel' })}
        onClick={onCloseClick}
        className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
      />
      <div className="flex w-full flex-grow flex-col pb-6 pr-6 [-webkit-overflow-scrolling:touch]">
        <div className="flex-grow">
          <h4 className="mb-2 heading-5">
            {formatText({ id: 'removeDraftModal.title' })}
          </h4>
          <p className="text-md text-gray-600">
            {formatText({
              id: 'removeDraftModal.subtitle',
            })}
          </p>
        </div>
        <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row">
          <Button mode="primaryOutline" isFullSize onClick={onViewDraftClick}>
            {formatText({
              id: 'removeDraftModal.button.viewDraft',
            })}
          </Button>
          <Button
            mode="primarySolid"
            isFullSize
            onClick={() => {
              handleRemoveDecisionFromLocalStorage(
                user?.walletAddress,
                colony.colonyAddress,
              );

              onCreateNewClick?.();
            }}
          >
            {formatText({ id: 'removeDraftModal.button.createNew' })}
          </Button>
        </div>
      </div>
    </ModalBase>
  );
};

export default RemoveDraftModal;
