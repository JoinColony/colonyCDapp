import { Extension } from '@colony/colony-js';
import { Trash } from '@phosphor-icons/react';
import clsx from 'clsx';
import React, { useState } from 'react';
import { FormattedMessage, defineMessages } from 'react-intl';

import { type AnyExtensionData } from '~types/extensions.ts';
import { formatText } from '~utils/intl.ts';
import Checkbox from '~v5/common/Checkbox/Checkbox.tsx';
import Button from '~v5/shared/Button/Button.tsx';
import Modal from '~v5/shared/Modal/Modal.tsx';

import { useExtensionDetailsPageContext } from '../../context/ExtensionDetailsPageContext.ts';

import { useUninstall } from './hooks.tsx';

const displayName =
  'frame.Extensions.pages.Extensions.ExtensionDetailsPage.partials.ExtensionDetails.UninstallButton';

const MSG = {
  [Extension.VotingReputation]: defineMessages({
    uninstallTitle: {
      id: `${displayName}.${Extension.VotingReputation}.uninstallTitle`,
      defaultMessage: 'Extension removal warning',
    },
    uninstallDescription: {
      id: `${displayName}.${Extension.VotingReputation}.uninstallDescription`,
      defaultMessage:
        'Uninstalling this extension will permanently delete all actions associated with this extension from this Colony. Ensure you understand the potential risks before continuing.',
    },
    uninstallWarning: {
      id: `${displayName}.${Extension.VotingReputation}.uninstallWarning`,
      defaultMessage:
        '<ul><li>All actions will disappear from the application and can never be recovered.</li><li>Please ensure that all funds in processes associated with this extension are claimed by their owners before uninstalling. Not doing so will result in permanent loss of the unclaimed funds.</li></ul>',
    },
    uninstallConfirmation: {
      id: `${displayName}.${Extension.VotingReputation}.uninstallConfirmation`,
      defaultMessage:
        'I understand that there is a risk of lost funds and past actions will disappear from the interface.',
    },
  }),
  [Extension.StreamingPayments]: defineMessages({
    uninstallTitle: {
      id: `${displayName}.${Extension.StreamingPayments}.uninstallTitle`,
      defaultMessage: 'Extension removal warning',
    },
    uninstallDescription: {
      id: `${displayName}.${Extension.StreamingPayments}.uninstallDescription`,
      defaultMessage:
        'Uninstalling this extension will remove the ability for the colony to create and manage streaming payments. Ensure you understand the potential risks before continuing.',
    },
    uninstallWarning: {
      id: `${displayName}.${Extension.StreamingPayments}.uninstallWarning`,
      defaultMessage:
        '<ul><li>The colony has at least one currently active stream. This extension cannot be uninstalled while any streams are still active, please cancel the stream or wait for its conclusion before uninstalling.</li><li>The colony has at least one stream with unclaimed funds. This extension cannot be uninstalled until all streamed funds have been claimed. Please claim all remaining unclaimed funds before uninstalling.</li></ul>',
    },
    uninstallConfirmation: {
      id: `${displayName}.${Extension.StreamingPayments}.uninstallConfirmation`,
      defaultMessage: "I understand that deleted accounts aren't recoverable",
    },
  }),
};

const ListChunks = (chunks: React.ReactNode[]) => (
  <ul className="list-disc pl-4">{chunks}</ul>
);
const ListItemChunks = (chunks: React.ReactNode[]) => <li>{chunks}</li>;

const UninstallButton = ({
  extensionData: { extensionId },
}: {
  extensionData: AnyExtensionData;
}) => {
  const [isUninstallModalOpen, setIsUninstallModalOpen] = useState(false);
  const [isCheckboxChecked, setIsCheckboxChecked] = useState(false);
  const { setActiveTab } = useExtensionDetailsPageContext();
  const { handleUninstall, isLoading } = useUninstall({
    extensionId,
    setActiveTab,
  });

  const isStreamingPaymentsExtension =
    extensionId === Extension.StreamingPayments;

  // @todo: add proper logic here to determine if there are active streams or unclaimed funds
  const hasAtLeastOneActiveStream = false;
  const hasUnclaimedFunds = false;

  return (
    <>
      <div className="flex w-full justify-center">
        <Button
          mode="primaryOutlineFull"
          size="small"
          isFullSize
          loading={isLoading}
          onClick={() => setIsUninstallModalOpen(true)}
        >
          {formatText({ id: 'button.uninstallExtension' })}
        </Button>
      </div>

      <Modal
        isOpen={isUninstallModalOpen}
        icon={Trash}
        isWarning
        onClose={() => {
          setIsCheckboxChecked(false);
          setIsUninstallModalOpen(false);
        }}
        onConfirm={handleUninstall}
        title={formatText(MSG[extensionId].uninstallTitle)}
        subTitle={formatText(MSG[extensionId].uninstallDescription)}
        confirmMessage={formatText({
          id: 'button.confirmUninstall',
        })}
        closeMessage={formatText({
          id: 'button.cancelUninstall',
        })}
        disabled={
          !isCheckboxChecked ||
          (isStreamingPaymentsExtension &&
            (hasAtLeastOneActiveStream || hasUnclaimedFunds))
        }
      >
        <div
          className={clsx(
            'mt-6 rounded-md border border-negative-400 bg-negative-100 p-4 text-sm text-negative-400',
            {
              '[&_li:nth-child(1)]:hidden':
                isStreamingPaymentsExtension && !hasAtLeastOneActiveStream,
              '[&_li:nth-child(2)]:hidden':
                isStreamingPaymentsExtension && !hasUnclaimedFunds,
              hidden:
                isStreamingPaymentsExtension &&
                !hasAtLeastOneActiveStream &&
                !hasUnclaimedFunds,
            },
          )}
        >
          <FormattedMessage
            {...MSG[extensionId].uninstallWarning}
            values={{
              ul: ListChunks,
              li: ListItemChunks,
            }}
          />
        </div>
        <Checkbox
          name="uninstall"
          id="uninstall"
          label={MSG[extensionId].uninstallConfirmation}
          isChecked={isCheckboxChecked}
          onChange={() => setIsCheckboxChecked((prevState) => !prevState)}
          classNames="mt-5"
        />
      </Modal>
    </>
  );
};

UninstallButton.displayName = displayName;

export default UninstallButton;
