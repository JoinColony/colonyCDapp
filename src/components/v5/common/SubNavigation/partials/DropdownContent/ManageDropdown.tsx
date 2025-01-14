import React, { type PropsWithChildren, type FC } from 'react';
import { useIntl } from 'react-intl';

import { LEARN_MORE_DECISIONS } from '~constants/index.ts';
import {
  ActionSidebarMode,
  useActionSidebarContext,
} from '~context/ActionSidebarContext/ActionSidebarContext.ts';
import LearnMore from '~shared/Extensions/LearnMore/index.ts';
import Button from '~v5/shared/Button/index.ts';
import TitleLabel from '~v5/shared/TitleLabel/index.ts';

import LinkItem from '../LinkItem/index.ts';

import { MANAGE_DROPDOWN_ITEMS, MSG } from './consts.ts';
import dropdownClasses from './DecideDropdown.styles.ts';

const displayName =
  'v5.common.SubNavigation.partials.DropdownContent.ManageDropdown';

const ManageDropdown: FC<PropsWithChildren> = () => {
  const { formatMessage } = useIntl();
  const { showActionSidebar } = useActionSidebarContext();

  return (
    <div className="bg-base-white">
      <TitleLabel
        className="mx-6 mt-6 hidden sm:block"
        text={formatMessage({ id: 'manageColony' })}
      />
      <ul className={dropdownClasses.listWrapper}>
        {MANAGE_DROPDOWN_ITEMS.map(({ action, ...rest }) => (
          <LinkItem
            {...rest}
            key={action}
            onClick={() => {
              showActionSidebar(ActionSidebarMode.CreateAction, {
                action: action,
              });
            }}
          />
        ))}
      </ul>
      <div className={dropdownClasses.buttonWrapper}>
        <Button text={MSG.buttonTextManage} mode="quinary" isFullSize />
      </div>
      <div className={dropdownClasses.infoWrapper}>
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
