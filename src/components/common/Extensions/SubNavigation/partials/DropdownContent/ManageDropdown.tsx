import React, { PropsWithChildren, FC } from 'react';
import { FormattedMessage } from 'react-intl';
import Button from '~shared/Extensions/Button/Button';
import { LEARN_MORE_DECISIONS } from '~constants';
import LinkItem from '../LinkItem';
import { MSG } from './consts';
import styles from './DropdownContent.module.css';
import LearnMore from '~shared/Extensions/LearnMore';

const displayName = 'common.Extensions.SubNavigation.partials.DropdownContent.ManageDropdown';

const ManageDropdown: FC<PropsWithChildren> = () => (
  <div className="text-gray-400 text-xs">
    <div className="hidden sm:block mx-6 mt-6 font-medium">
      <FormattedMessage {...MSG.manageContentTitle} />
    </div>
    <ul className={styles.listWrapper}>
      <LinkItem title={MSG.manageTeams} description={MSG.manageTeamsDescription} />
      <LinkItem title={MSG.manageReputation} description={MSG.manageReputationDescription} />
      <LinkItem title={MSG.managePermissions} description={MSG.managePermissionsDescription} />
      <LinkItem title={MSG.organizationDetails} description={MSG.organizationDetailsDescription} />
    </ul>
    <div className={styles.buttonWrapper}>
      <Button text={MSG.buttonTextManage} mode="secondaryOutline" isFullSize />
    </div>
    <div className={styles.infoWrapper}>
      <LearnMore
        message={{ id: `${displayName}.helpText`, defaultMessage: 'Need help with admin? <a>Learn more</a>' }}
        href={LEARN_MORE_DECISIONS}
      />
    </div>
  </div>
);

ManageDropdown.displayName = displayName;

export default ManageDropdown;
