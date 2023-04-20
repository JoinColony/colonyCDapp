import React, { PropsWithChildren } from 'react';
import { FormattedMessage } from 'react-intl';

import Button from '~shared/Extensions/Button/Button';
import { LEARN_MORE_DECISIONS } from '~constants';

import LinkItem from '../LinkItem';
import LearnMore from '../LearnMore';

import { MSG } from './consts';
import styles from './DropdownItems.module.css';

const displayName = 'common.Extensions.SubNavigation.Partials.DropdownContent.ManageDropdown';

const ManageDropdown: React.FC<PropsWithChildren> = () => (
  <div>
    <div className="text-gray-400 text-xs">
      <div className="hidden md:block mx-4 mt-4">
        <FormattedMessage {...MSG.manageContentTitle} />
      </div>
      <ul className={styles.listWrapper}>
        <LinkItem title={MSG.manageTeams} description={MSG.manageTeamsDescription} />
        <LinkItem title={MSG.manageReputation} description={MSG.manageReputationDescription} />
        <LinkItem title={MSG.managePermissions} description={MSG.managePermissionsDescription} />
        <LinkItem title={MSG.organizationDetails} description={MSG.organizationDetailsDescription} />
      </ul>
      <div className={styles.buttonWrapper}>
        <Button text={MSG.buttonTextManage} mode="primaryOutline" />
      </div>
      <div className="mt-8 mb-4 text-sm text-gray-900 flex justify-center">
        <FormattedMessage
          {...MSG.helpTextManage}
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
