import React, { PropsWithChildren, FC } from 'react';
import { useIntl } from 'react-intl';

import Button from '~v5/shared/Button';
import { LEARN_MORE_ADMIN } from '~constants';
import LinkItem from '../LinkItem';
import { MSG } from './consts';
import styles from './DropdownContent.module.css';
import LearnMore from '~shared/Extensions/LearnMore';
import TitleLabel from '~v5/shared/TitleLabel';
import { useActionSidebarContext } from '~context/ActionSidebarContext';

const displayName =
  'v5.common.SubNavigation.partials.DropdownContent.DecideDropdown';

const DecideDropdown: FC<PropsWithChildren> = () => {
  const { formatMessage } = useIntl();
  const {
    actionSidebarToggle: [, { toggleOn: toggleActionSideBarOn }],
  } = useActionSidebarContext();

  return (
    <div className="bg-base-white">
      <TitleLabel
        className="hidden sm:block mx-6 mt-6"
        text={formatMessage({ id: 'createNewDecisions' })}
      />
      <ul className={styles.listWrapper}>
        <LinkItem
          title={MSG.createDecision}
          description={MSG.createDecisionDescription}
          onClick={() => {
            // setSelectedAction(Actions.CREATE_DECISION);
            toggleActionSideBarOn();
          }}
        />
        <LinkItem
          title={MSG.simpleDiscussion}
          description={MSG.simpleDiscussionDescription}
          onClick={() => {
            // setSelectedAction(Actions.SIMPLE_DISCUSSION);
            toggleActionSideBarOn();
          }}
        />
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
