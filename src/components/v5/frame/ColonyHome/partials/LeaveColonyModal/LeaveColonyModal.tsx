import { WarningCircle } from '@phosphor-icons/react';
import React from 'react';
import { defineMessages } from 'react-intl';

import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
import { useColonyDashboardContext } from '~context/ColonyDashboardContext/ColonyDashboardContext.ts';
import useColonySubscription from '~hooks/useColonySubscription.ts';
import { formatText } from '~utils/intl.ts';
import Modal from '~v5/shared/Modal/index.ts';

const displayName = 'v5.frame.ColonyHome.LeaveColonyModal';
const MSG = defineMessages({
  leaveConfimModalTitle: {
    id: `${displayName}.leaveConfimModalTitle`,
    defaultMessage: 'Are you sure you want to leave this Colony?',
  },
  leaveConfirmModalSubtitle: {
    id: `${displayName}.leaveConfirmModalSubtitle`,
    defaultMessage: `Leaving this Colony will mean you are no longer able to access the Colony during the beta period. Ensure you have a copy of the invite code available to be able to re-join again.`,
  },
  leaveConfirmModalConfirmButton: {
    id: `${displayName}.leaveConfirmModalConfirmButton`,
    defaultMessage: 'Yes, leave this Colony',
  },
});

const LeaveColonyModal = () => {
  const { colony } = useColonyContext();
  const { handleUnwatch } = useColonySubscription(colony);
  const { isLeaveColonyModalOpen, closeLeaveColonyModal } =
    useColonyDashboardContext();

  return (
    <Modal
      title={formatText(MSG.leaveConfimModalTitle)}
      subtitle={formatText(MSG.leaveConfirmModalSubtitle)}
      isOpen={isLeaveColonyModalOpen}
      onClose={() => closeLeaveColonyModal()}
      onConfirm={() => {
        closeLeaveColonyModal();
        handleUnwatch();
      }}
      icon={WarningCircle}
      buttonMode="primarySolid"
      confirmMessage={formatText(MSG.leaveConfirmModalConfirmButton)}
      closeMessage={formatText({
        id: 'button.cancel',
      })}
    />
  );
};

LeaveColonyModal.displayName = displayName;
export default LeaveColonyModal;
