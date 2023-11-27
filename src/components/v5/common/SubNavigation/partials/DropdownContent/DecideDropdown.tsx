import React, { PropsWithChildren, FC } from 'react';
import { useIntl } from 'react-intl';

import Button from '~v5/shared/Button';
import { LEARN_MORE_ADMIN } from '~constants';
import LinkItem from '../LinkItem';
import { DECIDE_DROPDOWN_ITEMS, MSG } from './consts';
import styles from './DropdownContent.module.css';
import LearnMore from '~shared/Extensions/LearnMore';
import TitleLabel from '~v5/shared/TitleLabel';
import { useActionSidebarContext } from '~context/ActionSidebarContext';
import { ACTION_TYPE_FIELD_NAME } from '~v5/common/ActionSidebar/consts';

const displayName =
  'v5.common.SubNavigation.partials.DropdownContent.DecideDropdown';

const DecideDropdown: FC<PropsWithChildren> = () => {
  const { formatMessage } = useIntl();
  const {
    actionSidebarToggle: [, { toggleOn: toggleActionSidebarOn }],
  } = useActionSidebarContext();

  return (
    <div className="bg-base-white">
      <TitleLabel
        className="hidden sm:block mx-6 mt-6"
        text={formatMessage({ id: 'createNewDecisions' })}
      />
      <ul className={styles.listWrapper}>
        {DECIDE_DROPDOWN_ITEMS.map(({ action, ...rest }) => (
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
        <Button text={MSG.buttonTextDecide} mode="quinary" isFullSize />
      </div>
      <div className={styles.infoWrapper}>
        <LearnMore
          message={{
            id: `${displayName}.helpText`,
            defaultMessage: 'Need help with decisions? <a>Learn more</a>',
          }}
          href={LEARN_MORE_ADMIN}
        />
      </div>
    </div>
  );
};

DecideDropdown.displayName = displayName;

export default DecideDropdown;
