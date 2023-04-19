import React, { PropsWithChildren } from 'react';
import { FormattedMessage, defineMessages } from 'react-intl';

import Button from '~shared/Extensions/Button/Button';

import LinkItem from '../LinkItem';

import LearnMore from './LearnMore';
import styles from './DropdownItems.module.css';

const displayName = 'Extensions.SubNavigation.DropdownItems.DecideDropdown';

const MSG = defineMessages({
  decisionsContentTitle: {
    id: `${displayName}.decisionsContentTitle`,
    defaultMessage: 'CREATE NEW DECISIONS',
  },
  createDecision: {
    id: `${displayName}.createDecision`,
    defaultMessage: 'Create Decision',
  },
  createDecisionDescription: {
    id: `${displayName}.createDecisionDescription`,
    defaultMessage: 'Create a new decision.',
  },
  simpleDiscussion: {
    id: `${displayName}.simpleDiscussion`,
    defaultMessage: 'Simple Discussion',
  },
  simpleDiscussionDescription: {
    id: `${displayName}.simpleDiscussionDescription`,
    defaultMessage: 'Discuss plans get advice from others.',
  },
  buttonText: {
    id: `${displayName}.buttonText`,
    defaultMessage: 'View decisions',
  },
  helpText: {
    id: `${displayName}.helpText`,
    defaultMessage: 'Need help with decisions? <a>Learn more</a>',
  },
});

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
        <Button text={MSG.buttonText} mode="primaryOutline" />
      </div>
      <div className="mt-8 mb-4 text-sm text-gray-900 flex justify-center">
        <FormattedMessage
          {...MSG.helpText}
          values={{
            // eslint-disable-next-line react/no-unstable-nested-components
            a: (chunks) => <LearnMore chunks={chunks} href="/" />,
          }}
        />
      </div>
    </div>
  </div>
);

DecideDropdown.displayName = displayName;

export default DecideDropdown;
