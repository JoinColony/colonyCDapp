import React, { PropsWithChildren, FC } from 'react';
import { FormattedMessage } from 'react-intl';
import Button from '~shared/Extensions/Button/Button';
import { LEARN_MORE_ADMIN } from '~constants';
import LinkItem from '../LinkItem';
import { MSG } from './consts';
import styles from './DropdownContent.module.css';
import LearnMore from '~shared/Extensions/LearnMore';

const displayName = 'common.Extensions.SubNavigation.partials.DropdownContent.DecideDropdown';

const DecideDropdown: FC<PropsWithChildren> = () => (
  <div className="text-gray-400 text-xs">
    <div className="hidden sm:block mx-6 mt-6">
      <FormattedMessage {...MSG.decisionsContentTitle} />
    </div>
    <ul className={styles.listWrapper}>
      <LinkItem title={MSG.createDecision} description={MSG.createDecisionDescription} />
      <LinkItem title={MSG.simpleDiscussion} description={MSG.simpleDiscussionDescription} />
    </ul>
    <div className={styles.buttonWrapper}>
      <Button text={MSG.buttonTextDecide} mode="secondaryOutline" isFullSize />
    </div>
    <div className={styles.infoWrapper}>
      <LearnMore
        message={{ id: `${displayName}.helpText`, defaultMessage: 'Need help with decisions? <a>Learn more</a>' }}
        href={LEARN_MORE_ADMIN}
      />
    </div>
  </div>
);

DecideDropdown.displayName = displayName;

export default DecideDropdown;
