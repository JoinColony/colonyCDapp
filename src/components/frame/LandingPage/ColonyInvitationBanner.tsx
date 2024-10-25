import {
  SmileySticker,
  Ticket,
  CopySimple,
  Check,
} from '@phosphor-icons/react';
import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import useCopyToClipboard from '~hooks/useCopyToClipboard.ts';
import Button from '~v5/shared/Button/Button.tsx';

const displayName = 'frame.LandingPage';

export interface ColonyInvitationBannerProps {
  inviteLink: string;
  coloniesRemaining: number;
}

const MSG = defineMessages({
  title: {
    id: `${displayName}.title`,
    defaultMessage: `Early access colony invitations`,
  },
  remaining: {
    id: `${displayName}.remaining`,
    defaultMessage: `{remaining} colonies remaining`,
  },
  descriptionRemaining: {
    id: `${displayName}.descriptionRemaining`,
    defaultMessage: `As a part of the early access, creating a colony is limited to invites only. You can use the invites yourself or share with others.`,
  },
  descriptionNoRemaining: {
    id: `${displayName}.descriptionNoRemaining`,
    defaultMessage: `During early access, creating a colony is limited to invites only. You have no colony creation invites remaining. You can request additional invites.`,
  },
  copyButton: {
    id: `${displayName}.copyButton`,
    defaultMessage: `Copy link`,
  },
});

const ColonyInvitationBanner = ({
  inviteLink,
  coloniesRemaining,
}: ColonyInvitationBannerProps) => {
  const { handleClipboardCopy, isCopied } = useCopyToClipboard();

  const hasColoniesRemaining = coloniesRemaining > 0;

  return (
    <div className="w-full max-w-[31.25rem] rounded-2xl border px-6 py-6">
      <div className="flex h-10 w-10 items-center justify-center rounded-md border">
        <SmileySticker size={24} />
      </div>
      <h1 className="my-2.5 heading-4">
        <FormattedMessage {...MSG.title} />
      </h1>
      <span className="rounded-xl bg-blue-100 px-3 py-1 text-sm font-medium text-blue-400">
        <FormattedMessage
          {...MSG.remaining}
          values={{ remaining: coloniesRemaining }}
        />
      </span>

      <p className="mt-2 text-sm font-normal text-gray-700">
        <FormattedMessage
          {...(hasColoniesRemaining
            ? MSG.descriptionRemaining
            : MSG.descriptionNoRemaining)}
        />
      </p>
      {hasColoniesRemaining && (
        <div className="mt-2 flex flex-col gap-2 rounded-md bg-gray-50 px-3 py-3">
          <div className="flex items-center gap-2">
            <div>
              <Ticket size={18} />
            </div>
            <p className="truncate text-ellipsis text-md font-normal">
              {inviteLink}
            </p>
          </div>
          <Button
            icon={isCopied ? Check : CopySimple}
            mode="primaryOutline"
            onClick={() => handleClipboardCopy(inviteLink)}
          >
            <FormattedMessage {...MSG.copyButton} />
          </Button>
        </div>
      )}
    </div>
  );
};

ColonyInvitationBanner.displayName = displayName;

export default ColonyInvitationBanner;
