import React, { type PropsWithChildren, type FC } from 'react';
import { useIntl } from 'react-intl';

import { LEARN_MORE_DECISIONS } from '~constants/index.ts';
import { useActionSidebarContext } from '~context/ActionSidebarContext/ActionSidebarContext.ts';
import LearnMore from '~shared/Extensions/LearnMore/index.ts';
import { ACTION_TYPE_FIELD_NAME } from '~v5/common/ActionSidebar/consts.ts';
import Button from '~v5/shared/Button/index.ts';
import TitleLabel from '~v5/shared/TitleLabel/index.ts';

import LinkItem from '../LinkItem/index.ts';

import { MANAGE_DROPDOWN_ITEMS, MSG } from './consts.ts';

import styles from './DropdownContent.module.css';

const displayName =
  'v5.common.SubNavigation.partials.DropdownContent.ManageDropdown';

const ManageDropdown: FC<PropsWithChildren> = () => {
  const { formatMessage } = useIntl();
  const {
    actionSidebarToggle: [, { toggleOn: toggleActionSidebarOn }],
  } = useActionSidebarContext();

  return (
    <div className="bg-base-white">
      <TitleLabel
        className="hidden sm:block mx-6 mt-6"
        text={formatMessage({ id: 'manageColony' })}
      />
      <ul className={styles.listWrapper}>
        {MANAGE_DROPDOWN_ITEMS.map(({ action, ...rest }) => (
          <LinkItem
            {...rest}
            key={action}
            onClick={() => {
              toggleActionSidebarOn({
                [ACTION_TYPE_FIELD_NAME]: action,
              });
            }}
          />
        ))}
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
