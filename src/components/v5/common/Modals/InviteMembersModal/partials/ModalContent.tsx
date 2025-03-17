import { CopySimple } from '@phosphor-icons/react';
import clsx from 'clsx';
import React, { type FC } from 'react';
import { FormattedMessage, defineMessages } from 'react-intl';

import { getRequestInvitesLink } from '~constants/externalUrls.ts';
import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
import useBaseUrl from '~hooks/useBaseUrl.ts';
import useCopyToClipboard from '~hooks/useCopyToClipboard.ts';
import { formatText } from '~utils/intl.ts';
import Button from '~v5/shared/Button/index.ts';
import Card from '~v5/shared/Card/Card.tsx';
import Link from '~v5/shared/Link/Link.tsx';

const displayName = 'v5.common.Modals.InviteMembersModal.partials.ModalContent';

interface Props {
  isOutOfInvites: boolean;
  invitesAvailable: number;
}

const MSG = defineMessages({
  modalDescriptionReached: {
    id: `${displayName}.modalDescriptionReached`,
    defaultMessage:
      'You have reached your invite limit during early access. If you need more, please make a request.',
  },
  invitesUsed: {
    id: `${displayName}.invitesUsed`,
    defaultMessage:
      '{invitesAvailable} {invitesAvailable, plural, one {invite} other {invites}} remaining',
  },
  inviteLinkHeading: {
    id: `${displayName}.inviteLinkHeading`,
    defaultMessage: 'Unique colony invite link:',
  },
  limitReached: {
    id: `${displayName}.limitReached`,
    defaultMessage: 'Invite limit reached',
  },
  requestInvites: {
    id: `${displayName}.requestInvites`,
    defaultMessage: 'Request invites',
  },
  requestMoreInvites: {
    id: `${displayName}.requestMoreInvites`,
    defaultMessage: 'Request more invites for your colony',
  },
  buttonText: {
    id: `${displayName}.buttonText`,
    defaultMessage: `{isCopied, select,
      true {Link copied}
      other {Copy link}
    }`,
  },
});

const commonClassName = 'rounded-lg p-2 text-sm font-medium';

export const ModalContent: FC<Props> = ({
  isOutOfInvites,
  invitesAvailable,
}) => {
  const {
    colony: { colonyMemberInvite, name: colonyName },
  } = useColonyContext();
  const { handleClipboardCopy, isCopied } = useCopyToClipboard();

  const inviteLink = useBaseUrl(
    `/invite/${colonyName}/${colonyMemberInvite?.id}`,
  );

  if (isOutOfInvites) {
    return (
      <Card>
        <div className="mb-1.5 flex items-center gap-x-2">
          <h2
            className={clsx(
              commonClassName,
              'bg-negative-100 text-negative-400',
            )}
          >
            <FormattedMessage
              {...MSG.invitesUsed}
              values={{ invitesAvailable }}
            />
          </h2>
        </div>
        <div>
          <div className="flex w-full items-center justify-between gap-3">
            <div>
              <h3 className="mb-1 text-md font-medium">
                <FormattedMessage {...MSG.limitReached} />
              </h3>
              <p className="text-sm text-gray-600">
                <FormattedMessage {...MSG.requestMoreInvites} />
              </p>
            </div>
            <Link
              to={getRequestInvitesLink(colonyName)}
              target="_blank"
              className="flex min-h-8.5 items-center justify-center gap-2 whitespace-nowrap
              rounded-lg border border-gray-900 bg-base-white px-2.5 py-1.5 text-sm font-medium text-gray-900
              transition-all duration-normal disabled:border-gray-300 disabled:text-gray-300 md:hover:border-gray-900
              md:hover:bg-gray-900 md:hover:!text-base-white"
            >
              {formatText(MSG.requestInvites)}
            </Link>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <div className="mb-1.5 flex items-center gap-x-2">
        <h2 className={clsx(commonClassName, 'bg-blue-100 text-blue-400')}>
          <FormattedMessage
            {...MSG.invitesUsed}
            values={{ invitesAvailable }}
          />
        </h2>
      </div>
      <div>
        <div className="flex items-center gap-3">
          <div>
            <h3 className="mb-1 text-md font-medium">
              <FormattedMessage {...MSG.inviteLinkHeading} />
            </h3>
            <p className="break-all text-sm text-gray-600">{inviteLink}</p>
          </div>
          <Button
            text={MSG.buttonText}
            mode={isCopied ? 'completed' : 'quinary'}
            icon={isCopied ? undefined : CopySimple}
            onClick={() => handleClipboardCopy(inviteLink)}
            size="small"
            textValues={{ isCopied }}
          />
        </div>
      </div>
    </Card>
  );
};
