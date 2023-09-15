import React, { PropsWithChildren, FC } from 'react';
import { useIntl } from 'react-intl';

import Button from '~v5/shared/Button';
import { LEARN_MORE_DECISIONS } from '~constants';
import LinkItem from '../LinkItem';
import { MANAGE_DROPDOWN_ITEMS, MSG } from './consts';
import styles from './DropdownContent.module.css';
import LearnMore from '~shared/Extensions/LearnMore';
import TitleLabel from '~v5/shared/TitleLabel';
import { useActionSidebarContext } from '~context/ActionSidebarContext';
import dispatchGlobalEvent from '~utils/browser/dispatchGlobalEvent';
import { GLOBAL_EVENTS } from '~utils/browser/dispatchGlobalEvent/consts';

const displayName =
  'v5.common.SubNavigation.partials.DropdownContent.ManageDropdown';

const ManageDropdown: FC<PropsWithChildren> = () => {
  const { formatMessage } = useIntl();
  const {
    actionSidebarToggle: [, { toggleOn: toggleActionSidebarBarOn }],
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
              toggleActionSidebarBarOn();
              dispatchGlobalEvent(GLOBAL_EVENTS.SET_ACTION_TYPE, {
                detail: {
                  actionType: action,
                },
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
