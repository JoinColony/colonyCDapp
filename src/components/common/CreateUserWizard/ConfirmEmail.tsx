import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import { EmailPermissions } from '~gql';
import { Checkbox, Input } from '~shared/Fields';
import QuestionMarkTooltip from '~shared/QuestionMarkTooltip';

import { Message } from '~types';
import { displayName } from './StepUserEmail';

import styles from './StepUserEmail.css';

const MSG = defineMessages({
  confirmHumanity: {
    id: `${displayName}.confirmHumanity`,
    defaultMessage: "Confirm you're human so we can pay your gas costs 🤑",
  },
  confirmHumanityTooltip: {
    id: `${displayName}.confirmHumanityTooltip`,
    defaultMessage: `"Gas" is the term for payment required to interact with the blockchain. To keep things simple, we want to cover these costs for you.`,
  },
  sendNotifications: {
    id: `${displayName}.sendNotifications`,
    defaultMessage: 'Send notifications about activity in your colony 📬',
  },
  sendNotificationsTooltip: {
    id: `${displayName}.sendNotificationsTooltip`,
    defaultMessage: `We want to ensure that you are notified when things happen in your DAO that are important to you, e.g. a vote starts.`,
  },
  label: {
    id: `${displayName}.label`,
    defaultMessage: 'Your email',
  },
  explanation: {
    id: `${displayName}.explanation`,
    defaultMessage: 'We use your email address to:',
  },
});

type EmailPermission = `${EmailPermissions}`;

class PermissionDescription {
  permission: EmailPermission;

  label: Message;

  tooltipText: Message;

  constructor(
    permission: EmailPermission,
    label: Message,
    tooltipText: Message,
  ) {
    this.permission = permission;
    this.label = label;
    this.tooltipText = tooltipText;
  }
}

const permissions = [
  new PermissionDescription(
    EmailPermissions.IsHuman,
    MSG.confirmHumanity,
    MSG.confirmHumanityTooltip,
  ),
  new PermissionDescription(
    EmailPermissions.SendNotifications,
    MSG.sendNotifications,
    MSG.sendNotificationsTooltip,
  ),
];

const PermissionsHeading = () => (
  <p>
    <FormattedMessage {...MSG.explanation} />
  </p>
);

interface EmailPermissionsRowProps extends EmailPermissionsProps {
  tooltipText: Message;
  value: string;
  label: Message;
}

const EmailPermissionsRow = ({
  tooltipText,
  checkboxDisabled,
  value,
  label,
  onCheckboxChange,
}: EmailPermissionsRowProps) => (
  <div className={styles.emailPermissionsRow}>
    <Checkbox
      name="emailPermissions"
      label={label}
      disabled={checkboxDisabled}
      value={value}
      onChange={onCheckboxChange}
    />
    <QuestionMarkTooltip
      tooltipText={tooltipText}
      tooltipClassName={styles.tooltip}
    />
  </div>
);

interface EmailPermissionsProps {
  checkboxDisabled: boolean;
  onCheckboxChange: (...args: any) => void;
}

const EmailPermissionsSection = ({
  checkboxDisabled,
  onCheckboxChange,
}: EmailPermissionsProps) => {
  return (
    <section className={styles.emailPermissions}>
      <PermissionsHeading />
      {permissions.map(({ permission, label, tooltipText }) => (
        <EmailPermissionsRow
          key={permission}
          tooltipText={tooltipText}
          label={label}
          checkboxDisabled={checkboxDisabled}
          value={permission}
          onCheckboxChange={onCheckboxChange}
        />
      ))}
    </section>
  );
};

interface ConfirmEmailProps extends EmailPermissionsProps {
  inputDisabled: boolean;
}

const ConfirmEmail = ({
  onCheckboxChange,
  inputDisabled,
  checkboxDisabled,
}: ConfirmEmailProps) => (
  <>
    <Input
      appearance={{ theme: 'fat' }}
      name="email"
      label={MSG.label}
      disabled={inputDisabled}
    />
    <EmailPermissionsSection
      checkboxDisabled={checkboxDisabled}
      onCheckboxChange={onCheckboxChange}
    />
  </>
);

export default ConfirmEmail;
