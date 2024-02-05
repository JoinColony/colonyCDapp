import { WarningCircle } from '@phosphor-icons/react';
import React, { useCallback, type FC } from 'react';
import { useDispatch } from 'react-redux';

import { useAppContext } from '~context/AppContext.tsx';
import { useColonyContext } from '~context/ColonyContext.tsx';
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
    <ModalBase isOpen={isOpen} isFullOnMobile>
      <span className="flex items-center justify-center w-[2.5rem] h-[2.5rem] rounded border shadow-content mb-4 border-gray-200 flex-shrink-0">
        <WarningCircle size={24} />
      </span>
      <CloseButton
        aria-label={formatText({ id: 'ariaLabel.closeModal' })}
        title={formatText({ id: 'button.cancel' })}
        onClick={onCloseClick}
        className="text-gray-400 hover:text-gray-600 absolute top-4 right-4"
      />
      <div className="flex flex-col w-full flex-grow [-webkit-overflow-scrolling:touch] pb-6 pr-6">
        <div className="flex-grow">
          <h4 className="heading-5 mb-2">
            {formatText({ id: 'removeDraftModal.title' })}
          </h4>
          <p className="text-gray-600 text-md">
            {formatText({
              id: 'removeDraftModal.subtitle',
            })}
          </p>
        </div>
        <div className="flex flex-col-reverse gap-3 mt-8 sm:flex-row">
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
