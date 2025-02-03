import {
  NotePencil,
  PencilLine,
  Trash,
  WarningCircle,
} from '@phosphor-icons/react';
import clsx from 'clsx';
import React, { useCallback, type FC } from 'react';
import { useDispatch } from 'react-redux';

import { Action } from '~constants/actions.ts';
import {
  ActionSidebarMode,
  useActionSidebarContext,
} from '~context/ActionSidebarContext/ActionSidebarContext.ts';
import { useAppContext } from '~context/AppContext/AppContext.ts';
import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
import { useMobile } from '~hooks';
import { useDraftAgreement } from '~hooks/useDraftAgreement.ts';
import useToggle from '~hooks/useToggle/index.ts';
import { removeDecisionAction } from '~redux/actionCreators/index.ts';
import { DecisionMethod } from '~types/actions.ts';
import { MotionState } from '~utils/colonyMotions.ts';
import { formatText } from '~utils/intl.ts';
import {
  CREATED_IN_FIELD_NAME,
  DECISION_METHOD_FIELD_NAME,
  DESCRIPTION_FIELD_NAME,
  TITLE_FIELD_NAME,
} from '~v5/common/ActionSidebar/consts.ts';
import MotionStateBadge from '~v5/common/Pills/MotionStateBadge/MotionStateBadge.tsx';
import TeamBadge from '~v5/common/Pills/TeamBadge/index.ts';
import MeatBallMenu from '~v5/shared/MeatBallMenu/MeatBallMenu.tsx';
import Modal from '~v5/shared/Modal/index.ts';
import RichTextDisplay from '~v5/shared/RichTextDisplay/index.ts';
import { UserAvatar } from '~v5/shared/UserAvatar/UserAvatar.tsx';
import UserInfoPopover from '~v5/shared/UserInfoPopover/UserInfoPopover.tsx';

const DraftCard: FC = () => {
  const { colony } = useColonyContext();
  const { user, userLoading: loading } = useAppContext();
  const isMobile = useMobile();
  const [isModalOpen, { toggleOff, toggleOn }] = useToggle();

  const { draftAgreement } = useDraftAgreement();

  const { showActionSidebar } = useActionSidebarContext();

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
    showActionSidebar(ActionSidebarMode.CreateAction, {
      action: Action.CreateDecision,
      initialValues: {
        [TITLE_FIELD_NAME]: title,
        [DESCRIPTION_FIELD_NAME]: description,
        [DECISION_METHOD_FIELD_NAME]: DecisionMethod.Reputation,
        [CREATED_IN_FIELD_NAME]: motionDomainId,
      },
    });
  }, [description, motionDomainId, title, showActionSidebar]);

  const currentTeam = colony?.domains?.items.find(
    (domain) => domain?.nativeId === motionDomainId,
  );

  if (!walletAddress) {
    return null;
  }

  return (
    <>
      <div className="w-full rounded-lg border border-gray-200 bg-gray-25 px-5 pb-5 pt-6">
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
            <h3 className="text-gray-900 transition-colors text-1 sm:group-hover:text-blue-400">
              {title || formatText({ id: 'agreementsPage.title.placeholder' })}
            </h3>
            {description && (
              <RichTextDisplay
                content={description}
                shouldFormat={false}
                className="mt-2 line-clamp-4 !text-sm !text-gray-600 break-word"
              />
            )}
          </button>
        </div>
        <div className="mt-4 flex w-full items-center justify-between gap-4 border-t border-t-gray-200 pt-4">
          <UserInfoPopover
            user={user}
            walletAddress={walletAddress}
            withVerifiedBadge={false}
            popperOptions={{
              placement: 'bottom-start',
            }}
            className={clsx(
              'flex items-center text-gray-600 sm:gap-2 sm:hover:text-blue-400',
              {
                'pointer-events-none': loading,
              },
            )}
          >
            <UserAvatar
              size={30}
              userAvatarSrc={user?.profile?.avatar ?? undefined}
              userAddress={walletAddress}
              userName={user?.profile?.displayName ?? undefined}
              className={clsx({
                'skeleton before:rounded-full': loading,
              })}
            />
            <p
              className={clsx('hidden text-sm text-gray-600 sm:inline-block', {
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
          </UserInfoPopover>
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
        subtitle={formatText({
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
