import { CopySimple } from '@phosphor-icons/react';
import React from 'react';
import { FormattedMessage, defineMessages } from 'react-intl';

import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
import useBaseUrl from '~hooks/useBaseUrl.ts';
import useCopyToClipboard from '~hooks/useCopyToClipboard.ts';
import { Heading3 } from '~shared/Heading/index.ts';
import Button from '~v5/shared/Button/index.ts';
import CardWithCallout from '~v5/shared/CardWithCallout/index.ts';
import Modal from '~v5/shared/Modal/index.ts';

const displayName = 'v5.common.Modals.InviteMembersModal';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const MSG = defineMessages({
  modalTitle: {
    id: `${displayName}.modalTitle`,
    defaultMessage: 'Invite members to the private beta',
  },
  modalDescription: {
    id: `${displayName}.modalDescription`,
    defaultMessage:
      'You can invite up to 100 members to your Colony during the private beta using the invite link below.',
  },
  invitesUsed: {
    id: `${displayName}.invitesUsed`,
    defaultMessage: '{invitesUsed}/{invitesAvailable} invites used',
  },
  inviteLinkHeading: {
    id: `${displayName}.inviteLinkHeading`,
    defaultMessage: 'Your unique invite link:',
  },
  buttonText: {
    id: `${displayName}.buttonText`,
    defaultMessage: `{isCopied, select,
      true {Link copied}
      other {Copy link}
    }`,
  },
});

const InviteMembersModal = ({ isOpen, onClose }: Props) => {
  const {
    colony: { colonyMemberInvite, name: colonyName },
  } = useColonyContext();

  const invitesAvailable = 100;
  const inviteLink = useBaseUrl(
    `/invite/${colonyName}/${colonyMemberInvite?.id}`,
  );
  const invitesUsed = 100 - (colonyMemberInvite?.invitesRemaining || 0);

  const { handleClipboardCopy, isCopied } = useCopyToClipboard();

  return (
    <Modal isOpen={isOpen} onClose={() => onClose()}>
      <div className="mt-10 flex flex-col items-center mb-8">
        <Heading3
          appearance={{ theme: 'dark' }}
          className="text-gray-900 font-semibold"
          text={MSG.modalTitle}
        />
        <p className="mt-1 text-center text-sm text-gray-600">
          <FormattedMessage {...MSG.modalDescription} />
        </p>
      </div>
      <CardWithCallout
        title={
          <span className="rounded-lg bg-gray-100 text-sm font-medium text-gray-900 p-2">
            <FormattedMessage
              {...MSG.invitesUsed}
              values={{ invitesAvailable, invitesUsed }}
            />
          </span>
        }
        subtitle={<FormattedMessage {...MSG.inviteLinkHeading} />}
        button={
          <Button
            text={MSG.buttonText}
            mode={isCopied ? 'completed' : 'quinary'}
            icon={isCopied ? undefined : CopySimple}
            onClick={() => handleClipboardCopy(inviteLink)}
            size="small"
            textValues={{ isCopied }}
          />
        }
      >
        {inviteLink}
      </CardWithCallout>
    </Modal>
  );
};

InviteMembersModal.displayName = displayName;

export default InviteMembersModal;
