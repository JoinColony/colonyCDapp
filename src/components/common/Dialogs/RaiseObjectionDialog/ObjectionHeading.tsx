import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import { DialogSection } from '~shared/Dialog';
import ExternalLink from '~shared/ExternalLink';
import { Heading3 } from '~shared/Heading';
import { MD_OBJECTIONS_HELP } from '~constants';

import styles from './ObjectionHeading.css';

const displayName = 'common.Dialogs.RaiseObjectiongDialog.ObjectionHeading';

const MSG = defineMessages({
  title: {
    id: `${displayName}.title`,
    defaultMessage: 'Raise an objection',
  },
  objectionDescription: {
    id: `${displayName}.objectionDescription`,
    defaultMessage: `
    You are about to make an objection to the motion. If fully staked,
    it will immediately start a voting process to determine whether
    the motion should pass. <a>Learn more</a>`,
  },
});

const objectionDescriptionMessageValues = {
  a: (chunks) => (
    <ExternalLink href={MD_OBJECTIONS_HELP}>{chunks}</ExternalLink>
  ),
};

const ObjectionDescription = () => (
  <div className={styles.descriptionText}>
    <FormattedMessage
      {...MSG.objectionDescription}
      values={objectionDescriptionMessageValues}
    />
  </div>
);

const ObjectionHeading = () => (
  <>
    <DialogSection appearance={{ theme: 'heading' }}>
      <Heading3
        appearance={{ margin: 'none' }}
        text={MSG.title}
        className={styles.title}
      />
    </DialogSection>
    <DialogSection appearance={{ theme: 'sidePadding', border: 'bottom' }}>
      <ObjectionDescription />
    </DialogSection>
  </>
);

ObjectionHeading.displayName = displayName;

export default ObjectionHeading;
