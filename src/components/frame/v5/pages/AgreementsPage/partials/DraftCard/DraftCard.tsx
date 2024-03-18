import {
  NotePencil,
  PencilLine,
  Trash,
  WarningCircle,
} from '@phosphor-icons/react';
import clsx from 'clsx';
import React, { useCallback, type FC } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { Action } from '~constants/actions.ts';
import { useActionSidebarContext } from '~context/ActionSidebarContext/ActionSidebarContext.ts';
import { useAppContext } from '~context/AppContext/AppContext.ts';
import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
import { useMobile } from '~hooks';
import useToggle from '~hooks/useToggle/index.ts';
import { removeDecisionAction } from '~redux/actionCreators/index.ts';
import { DecisionMethod } from '~types/actions.ts';
import { MotionState } from '~utils/colonyMotions.ts';
import { getDraftDecisionFromStore } from '~utils/decisions.ts';
import { formatText } from '~utils/intl.ts';
import {
  ACTION_TYPE_FIELD_NAME,
  DECISION_METHOD_FIELD_NAME,
} from '~v5/common/ActionSidebar/consts.ts';
import MotionStateBadge from '~v5/common/Pills/MotionStateBadge/MotionStateBadge.tsx';
import TeamBadge from '~v5/common/Pills/TeamBadge/index.ts';
import Avatar from '~v5/shared/Avatar/Avatar.tsx';
import MeatBallMenu from '~v5/shared/MeatBallMenu/MeatBallMenu.tsx';
import Modal from '~v5/shared/Modal/index.ts';
import RichTextDisplay from '~v5/shared/RichTextDisplay/index.ts';
import UserPopover from '~v5/shared/UserPopover/UserPopover.tsx';

const DraftCard: FC = () => {
  const { colony } = useColonyContext();
  const { user, userLoading: loading } = useAppContext();
  const isMobile = useMobile();
  const [isModalOpen, { toggleOff, toggleOn }] = useToggle();
  const draftAgreement = useSelector(
    getDraftDecisionFromStore(user?.walletAddress || '', colony.colonyAddress),
  );

  const {
    actionSidebarToggle: [, { toggleOn: toggleActionSidebarOn }],
  } = useActionSidebarContext();

  const dispatch = useDispatch();

  const handleRemoveAgreementFromLocalStorage = useCallback(
    (walletAddress: string, colonyAddress: string) => {
      dispatch(removeDecisionAction(walletAddress, colonyAddress));
    },
    [dispatch],
  );

  const { description, title, walletAddress, motionDomainId } =
    draftAgreement || {};

  const openModal = useCallback(() => {
    toggleActionSidebarOn({
      [ACTION_TYPE_FIELD_NAME]: Action.CreateDecision,
      title,
      description,
      [DECISION_METHOD_FIELD_NAME]: DecisionMethod.Reputation,
      createdIn: motionDomainId,
    });
  }, [description, motionDomainId, title, toggleActionSidebarOn]);

  const currentTeam = colony?.domains?.items.find(
    (domain) => domain?.nativeId === motionDomainId,
  );

  if (!walletAddress) {
    return null;
  }

  return (
    <>
      <div className="w-full border border-gray-200 bg-gray-25 rounded-lg pt-6 px-5 pb-5">
        <div className="w-full">
          <MotionStateBadge
            state={MotionState.Draft}
            icon={NotePencil}
            className="mb-4"
          />
          <button
            type="button"
            className="group block text-left"
            onClick={openModal}
          >
            <h3 className="text-1 text-gray-900 sm:group-hover:text-blue-400 transition-colors">
              {title || formatText({ id: 'agreementsPage.title.placeholder' })}
            </h3>
            {description && (
              <RichTextDisplay
                content={description}
                shouldFormat={false}
                className="!text-sm !text-gray-600 mt-2 break-word line-clamp-4"
              />
            )}
          </button>
        </div>
        <div className="w-full pt-4 mt-4 border-t border-t-gray-200 flex justify-between items-center gap-4">
          <UserPopover
            user={user}
            userName={user?.profile?.displayName || walletAddress}
            walletAddress={walletAddress}
            withVerifiedBadge={false}
            className={clsx('flex items-center sm:gap-2', {
              'pointer-events-none': loading,
            })}
          >
            <Avatar
              seed={walletAddress?.toLowerCase()}
              title={user?.profile?.displayName || walletAddress}
              avatar={user?.profile?.thumbnail || user?.profile?.avatar}
              size="sm"
              className={clsx({
                'skeleton before:rounded-full': loading,
              })}
            />
            <p
              className={clsx('text-sm text-gray-600 hidden sm:inline-block', {
                skeleton: loading,
              })}
            >
              {loading
                ? 'Loading...'
                : formatText(
                    { id: 'agreementsPage.createdBy' },
                    {
                      username: user?.profile?.displayName || walletAddress,
                    },
                  )}
            </p>
          </UserPopover>
          <div className="flex items-center gap-2">
            {currentTeam && (
              <TeamBadge
                name={currentTeam.metadata?.name || ''}
                color={currentTeam.metadata?.color}
              />
            )}
            <MeatBallMenu
              withVerticalIcon
              contentWrapperClassName={clsx('sm:min-w-[14.375rem]', {
                '!left-6 right-6': isMobile,
              })}
              dropdownPlacementProps={{
                withAutoTopPlacement: true,
                top: 12,
              }}
              items={[
                {
                  key: '1',
                  label: formatText({ id: 'agreementsPage.editDraft' }),
                  icon: PencilLine,
                  onClick: openModal,
                },
                {
                  key: '2',
                  label: formatText({ id: 'agreementsPage.deleteDraft' }),
                  icon: Trash,
                  onClick: toggleOn,
                },
              ]}
            />
          </div>
        </div>
      </div>
      <Modal
        title={formatText({ id: 'deleteAgreementDraftModal.title' })}
        subTitle={formatText({
          id: 'deleteAgreementDraftModal.subtitle',
        })}
        isOpen={isModalOpen}
        onClose={toggleOff}
        onConfirm={() => {
          handleRemoveAgreementFromLocalStorage(
            walletAddress,
            colony.colonyAddress,
          );
          toggleOff();
        }}
        icon={WarningCircle}
        buttonMode="primarySolid"
        confirmMessage={formatText({ id: 'button.confirmDeletion' })}
        closeMessage={formatText({
          id: 'button.cancel',
        })}
      />
    </>
  );
};

export default DraftCard;
