import React, { PropsWithChildren, FC } from 'react';
import { useIntl } from 'react-intl';

import Button from '~v5/shared/Button';
import { LEARN_MORE_DECISIONS } from '~constants';
import LinkItem from '../LinkItem';
import { MSG } from './consts';
import styles from './DropdownContent.module.css';
import LearnMore from '~shared/Extensions/LearnMore';
import TitleLabel from '~v5/shared/TitleLabel';
import { useActionSidebarContext } from '~context/ActionSidebarContext';
import { Actions } from '~constants/actions';

const displayName =
  'v5.common.SubNavigation.partials.DropdownContent.ManageDropdown';

const ManageDropdown: FC<PropsWithChildren> = () => {
  const { formatMessage } = useIntl();
  const { toggleActionBar, setSelectedAction } = useActionSidebarContext();

  return (
    <div className="bg-base-white">
      <TitleLabel
        className="hidden sm:block mx-6 mt-6"
        text={formatMessage({ id: 'manageColony' })}
      />
      <ul className={styles.listWrapper}>
        <LinkItem
          title={MSG.manageTeams}
          description={MSG.manageTeamsDescription}
          onClick={() => {
            setSelectedAction(Actions.EDIT_EXISTING_TEAM);
            toggleActionBar();
          }}
        />
        <LinkItem
          title={MSG.manageReputation}
          description={MSG.manageReputationDescription}
          onClick={() => {
            setSelectedAction(Actions.AWARD_REPUTATION);
            toggleActionBar();
          }}
        />
        <LinkItem
          title={MSG.managePermissions}
          description={MSG.managePermissionsDescription}
          onClick={() => {
            setSelectedAction(Actions.MANAGE_PERMISSIONS);
            toggleActionBar();
          }}
        />
        <LinkItem
          title={MSG.organizationDetails}
          description={MSG.organizationDetailsDescription}
          onClick={() => {
            setSelectedAction(Actions.EDIT_COLONY_DETAILS);
            toggleActionBar();
          }}
        />
      </ul>
      <div className={styles.buttonWrapper}>
        <Button text={MSG.buttonTextManage} mode="quinary" isFullSize />
      </div>
      <div className={styles.infoWrapper}>
        <LearnMore
          message={{
            id: `${displayName}.helpText`,
            defaultMessage: 'Need help with admin? <a>Learn more</a>',
          }}
          href={LEARN_MORE_DECISIONS}
        />
      </div>
    </div>
  );
};

ManageDropdown.displayName = displayName;

export default ManageDropdown;
