import React from 'react';
import { useIntl, defineMessages, FormattedMessage } from 'react-intl';
import { ColonyRole } from '@colony/colony-js';

import Heading from '~shared/Heading';
import PermissionsLabel from '~shared/PermissionsLabel';
import Icon from '~shared/Icon';
import { Tooltip } from '~shared/Popover';

import styles from './PermissionRequiredInfo.css';

const displayName = 'PermissionRequiredInfo';

const MSG = defineMessages({
  title: {
    id: `${displayName}.title`,
    defaultMessage: 'You need the following permission(s)',
  },
  sectionLabel: {
    id: `${displayName}.sectionLabel`,
    defaultMessage: 'Permission',
  },
  tooltipTextFirstParagraph: {
    id: `${displayName}.tooltipTextFirstParagraph`,
    defaultMessage: `Colony has six permission classes which can be assigned
      to any Ethereum address: Funding, Administration, Arbitration,
      Architecture, Root, and Recovery.`,
  },
  tooltipTextSecondParagraph: {
    id: `${displayName}.tooltipTextSecondParagraph`,
    defaultMessage: `Permissions are assigned at the team level.
      If an account is granted a permission in a team,
      it also has that same permission in all of that
      team’s subteams.`,
  },
});

interface Props {
  /** Array with roles required */
  requiredRoles: ColonyRole[];
}

const PermissionRequiredInfo = ({ requiredRoles }: Props) => {
  const { formatMessage } = useIntl();
  const tooltipText = (
    <div className={styles.tooltipContent}>
      <p className={styles.tooltipText}>
        <FormattedMessage {...MSG.tooltipTextFirstParagraph} />
      </p>
      <p className={styles.tooltipText}>
        <FormattedMessage {...MSG.tooltipTextSecondParagraph} />
      </p>
    </div>
  );

  return (
    <div>
      <Heading
        appearance={{ size: 'normal', weight: 'bold' }}
        text={MSG.title}
        className={styles.title}
      />
      <div className={styles.requiredPermissionSection}>
        <div className={styles.section}>
          <p className={styles.sectionLabel}>
            <FormattedMessage {...MSG.sectionLabel} />
          </p>
          <Tooltip content={tooltipText} placement="right">
            <div className={styles.labelIcon}>
              <Icon name="question-mark" />
            </div>
          </Tooltip>

          <div className={styles.permissionList}>
            {requiredRoles.map((role) => (
              <div className={styles.listItem} key={`permission.${role}`}>
                <PermissionsLabel
                  permission={role}
                  name={formatMessage({ id: `role.${role}` })}
                />
              </div>
            ))}
          </div>
        </div>
        <Icon
          name="circle-close"
          title="Error"
          appearance={{ size: 'medium' }}
        />
      </div>
    </div>
  );
};

PermissionRequiredInfo.displayName = displayName;

export default PermissionRequiredInfo;
