import { Extension } from '@colony/colony-js';
import { Trash } from '@phosphor-icons/react';
import React, { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { FormattedMessage, defineMessages } from 'react-intl';

import { useExtensionDetailsPageContext } from '~frame/Extensions/pages/ExtensionDetailsPage/context/ExtensionDetailsPageContext.ts';
import { type AnyExtensionData } from '~types/extensions.ts';
import { formatText } from '~utils/intl.ts';
import Checkbox from '~v5/common/Checkbox/Checkbox.tsx';
import Button from '~v5/shared/Button/Button.tsx';
import Modal from '~v5/shared/Modal/Modal.tsx';

import { useUninstall } from './hooks.tsx';

const displayName = 'pages.ExtensionDetailsPage.UninstallButton';

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
  [Extension.MultisigPermissions]: defineMessages({
    uninstallTitle: {
      id: `${displayName}.${Extension.MultisigPermissions}.uninstallTitle`,
      defaultMessage: 'Extension removal warning',
    },
    uninstallDescription: {
      id: `${displayName}.${Extension.MultisigPermissions}.uninstallDescription`,
      defaultMessage:
        'Uninstalling this extension will permanently delete all actions associated with this extension from this Colony. Ensure you understand the potential risks before continuing.',
    },
    uninstallWarning: {
      id: `${displayName}.${Extension.MultisigPermissions}.uninstallWarning`,
      defaultMessage:
        '<ul><li>All actions will disappear from the application and can never be recovered.</li><li>Please ensure that all funds in processes associated with this extension are claimed by their owners before uninstalling. Not doing so will result in permanent loss of the unclaimed funds.</li></ul>',
    },
    uninstallConfirmation: {
      id: `${displayName}.${Extension.MultisigPermissions}.uninstallConfirmation`,
      defaultMessage:
        'I understand that there is a risk of lost funds and past actions will disappear from the interface.',
    },
  }),
  [Extension.StagedExpenditure]: defineMessages({
    uninstallTitle: {
      id: `${displayName}.${Extension.StakedExpenditure}.uninstallTitle`,
      defaultMessage: 'Extension removal warning',
    },
    uninstallDescription: {
      id: `${displayName}.${Extension.StakedExpenditure}.uninstallDescription`,
      defaultMessage:
        'Uninstalling this extension will remove the functionality to be able to complete unreleased Staged payments and create new ones. Ensure you understand the potential risks before continuing.',
    },
    uninstallWarning: {
      id: `${displayName}.${Extension.StakedExpenditure}.uninstallWarning`,
      defaultMessage:
        '<ul><li>Please ensure that all funds in processes associated with this extension are released before uninstalling. Not doing so will result in permanent loss of the unclaimed funds.</li></ul>',
    },
    uninstallConfirmation: {
      id: `${displayName}.${Extension.StakedExpenditure}.uninstallConfirmation`,
      defaultMessage: 'I understand that unreleased funds cannot be released',
    },
  }),
  [Extension.StakedExpenditure]: defineMessages({
    uninstallTitle: {
      id: `${displayName}.${Extension.StakedExpenditure}.uninstallTitle`,
      defaultMessage: 'Extension removal warning',
    },
    uninstallDescription: {
      id: `${displayName}.${Extension.StakedExpenditure}.uninstallDescription`,
      defaultMessage:
        'Uninstalling this extension will remove the functionality to be able to create payments by staking. Ensure you understand the potential risks before continuing.',
    },
    uninstallWarning: {
      id: `${displayName}.${Extension.StakedExpenditure}.uninstallWarning`,
      defaultMessage:
        '<ul><li>Please ensure that all funds in processes associated with this extension are claimed by their owners before uninstalling. Not doing so will result in permanent loss of the unclaimed funds.</li></ul>',
    },
    uninstallConfirmation: {
      id: `${displayName}.${Extension.StakedExpenditure}.uninstallConfirmation`,
      defaultMessage:
        'I understand that funds can be lost and are unrecoverable',
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
        'Uninstalling this extension will remove the ability for the colony to create and manage streaming payments. Ensure you understand the potential risks before continuing.',
    },
    uninstallWarning: {
      id: `${displayName}.${Extension.StreamingPayments}.uninstallWarning`,
      defaultMessage:
        '{hasActiveStream, select, true {<li>The colony has at least one currently active stream. This extension cannot be uninstalled while any streams are still active, please cancel the stream or wait for its conclusion before uninstalling.</li>} other {}}{hasUnclaimedFunds, select, true {<li>The colony has at least one stream with unclaimed funds. This extension cannot be uninstalled until all streamed funds have been claimed. Please claim all remaining unclaimed funds before uninstalling.</li>} other {}}',
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

const UninstallButton = ({
  extensionData: { extensionId },
}: {
  extensionData: AnyExtensionData;
}) => {
  const [isUninstallModalOpen, setIsUninstallModalOpen] = useState(false);
  const [isCheckboxChecked, setIsCheckboxChecked] = useState(false);
  const { handleUninstall, isLoading } = useUninstall(extensionId);
  const { isPendingManagement } = useExtensionDetailsPageContext();

  const {
    formState: { isSubmitting },
  } = useFormContext();

  const isStreamingPaymentsExtension =
    extensionId === Extension.StreamingPayments;

  // @todo: add proper logic here to determine if there are active streams or unclaimed funds
  const hasActiveStream = false;
  const hasUnclaimedFunds = false;

  const shouldShowWarning =
    isStreamingPaymentsExtension && (hasActiveStream || hasUnclaimedFunds);

  const isStreamingPaymentsExtension =
    extensionId === Extension.StreamingPayments;

  // @todo: add proper logic here to determine if there are active streams or unclaimed funds
  const hasActiveStream = false;
  const hasUnclaimedFunds = false;

  const shouldShowWarning =
    isStreamingPaymentsExtension && (hasActiveStream || hasUnclaimedFunds);

  return (
    <>
      <div className="flex w-full justify-center">
        <Button
          mode="primaryOutlineFull"
          size="small"
          isFullSize
          loading={isLoading}
          onClick={() => setIsUninstallModalOpen(true)}
          disabled={isPendingManagement || isSubmitting}
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
        disabled={!isCheckboxChecked}
      >
        {shouldShowWarning && (
          <div className="mt-6 rounded-md border border-negative-400 bg-negative-100 p-4 text-sm text-negative-400">
            <FormattedMessage
              {...MSG[extensionId].uninstallWarning}
              values={{
                ul: ListChunks,
                hasActiveStream,
                hasUnclaimedFunds,
              }}
            />
          </div>
        )}
        <Checkbox
          name="uninstall"
          id="uninstall"
          label={MSG[extensionId].uninstallConfirmation}
          isChecked={isCheckboxChecked}
          onChange={() => setIsCheckboxChecked((prevState) => !prevState)}
          className="mt-5"
        />
      </Modal>
    </>
  );
};

UninstallButton.displayName = displayName;

export default UninstallButton;
