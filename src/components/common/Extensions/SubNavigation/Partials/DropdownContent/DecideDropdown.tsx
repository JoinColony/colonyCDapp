import React, { PropsWithChildren } from 'react';
import { FormattedMessage } from 'react-intl';

import Button from '~shared/Extensions/Button/Button';
import { LEARN_MORE_ADMIN } from '~constants';

import LinkItem from '../LinkItem';
import LearnMore from '../LearnMore';

import { MSG } from './consts';
import styles from './DropdownItems.module.css';

const displayName = 'common.Extensions.SubNavigation.Partials.DropdownContent.DecideDropdown';

const DecideDropdown: React.FC<PropsWithChildren> = () => (
  <div>
    <div className="text-gray-400 text-xs">
      <div className="hidden md:block mx-4 mt-4">
        <FormattedMessage {...MSG.decisionsContentTitle} />
      </div>
      <ul className={styles.listWrapper}>
        <LinkItem title={MSG.createDecision} description={MSG.createDecisionDescription} />
        <LinkItem title={MSG.simpleDiscussion} description={MSG.simpleDiscussionDescription} />
      </ul>
      <div className={styles.buttonWrapper}>
        <Button text={MSG.buttonTextDecide} mode="primaryOutline" />
      </div>
      <div className="mt-8 mb-4 text-sm text-gray-900 flex justify-center">
        <FormattedMessage
          {...MSG.helpTextDecide}
          values={{
            // eslint-disable-next-line react/no-unstable-nested-components
            a: (chunks) => <LearnMore chunks={chunks} href={LEARN_MORE_ADMIN} />,
          }}
        />
      </div>
    </div>
  </div>
);

DecideDropdown.displayName = displayName;

export default DecideDropdown;
