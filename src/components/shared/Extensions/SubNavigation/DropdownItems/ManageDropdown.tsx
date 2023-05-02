import React, { PropsWithChildren } from 'react';
import { FormattedMessage, defineMessages } from 'react-intl';

import Button from '~shared/Extensions/Button/Button';
import { LEARN_MORE_DECISIONS } from '~constants';

import LinkItem from '../LinkItem';

import LearnMore from './LearnMore';
import styles from './DropdownItems.module.css';

const displayName = 'Extensions.SubNavigation.DropdownItems.ManageDropdown';

const MSG = defineMessages({
  decisionsContentTitle: {
    id: `${displayName}.decisionsContentTitle`,
    defaultMessage: 'MANAGE COLONY',
  },
  manageTeams: {
    id: `${displayName}.manageTeams`,
    defaultMessage: 'Manage Teams',
  },
  manageTeamsDescription: {
    id: `${displayName}.manageTeamsDescription`,
    defaultMessage: 'View, Add, and Edit teams.',
  },
  manageReputation: {
    id: `${displayName}.manageReputation`,
    defaultMessage: 'Manage Reputation',
  },
  manageReputationDescription: {
    id: `${displayName}.manageReputationDescription`,
    defaultMessage: 'Award or remove reputation.',
  },
  managePermissions: {
    id: `${displayName}.managePermissions`,
    defaultMessage: 'Manage Permissions',
  },
  managePermissionsDescription: {
    id: `${displayName}.managePermissionsDescription`,
    defaultMessage: 'Add, change or remove permissions.',
  },
  organizationDetails: {
    id: `${displayName}.organizationDetails`,
    defaultMessage: 'Organization Details',
  },
  organizationDetailsDescription: {
    id: `${displayName}.organizationDetailsDescription`,
    defaultMessage: 'Add or update the details of the DAO.',
  },
  buttonText: {
    id: `${displayName}.buttonText`,
    defaultMessage: 'View admin area',
  },
  helpText: {
    id: `${displayName}.helpText`,
    defaultMessage: 'Need help with admin? <a>Learn more</a>',
  },
});

const ManageDropdown: React.FC<PropsWithChildren> = () => (
  <div>
    <div className="text-gray-400 text-xs">
      <div className="hidden md:block mx-4 mt-4">
        <FormattedMessage {...MSG.decisionsContentTitle} />
      </div>
      <ul className={styles.listWrapper}>
        <LinkItem title={MSG.manageTeams} description={MSG.manageTeamsDescription} />
        <LinkItem title={MSG.manageReputation} description={MSG.manageReputationDescription} />
        <LinkItem title={MSG.managePermissions} description={MSG.managePermissionsDescription} />
        <LinkItem title={MSG.organizationDetails} description={MSG.organizationDetailsDescription} />
      </ul>
      <div className={styles.buttonWrapper}>
        <Button text={MSG.buttonText} mode="primaryOutline" />
      </div>
      <div className="mt-8 mb-4 text-sm text-gray-900 flex justify-center">
        <FormattedMessage
          {...MSG.helpText}
          values={{
            // eslint-disable-next-line react/no-unstable-nested-components
            a: (chunks) => <LearnMore chunks={chunks} href={LEARN_MORE_DECISIONS} />,
          }}
        />
      </div>
    </div>
  </div>
);

ManageDropdown.displayName = displayName;

export default ManageDropdown;
