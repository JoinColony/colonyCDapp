import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import { nanoid } from 'nanoid';

import Button from '~shared/Button';
import { DialogSection } from '~shared/Dialog';
import { Heading3 } from '~shared/Heading';

import styles from './RemoveDecisionMessage.css';

const displayName = `common.ColonyDecisions.RemoveExistingDecisionDialog.RemoveDecisionMessage`;

const MSG = defineMessages({
  title: {
    id: `${displayName}.title`,
    defaultMessage: '{removeDraft} and create new Decision',
  },
  removeDraft: {
    id: `${displayName}.removeDraft`,
    defaultMessage: 'Remove draft',
  },
  description: {
    id: `${displayName}.description`,
    defaultMessage: `You have an existing draft Decision, creating a new Decision will remove your existing draft. {viewDraftBtn}`,
  },
  viewDraft: {
    id: `${displayName}.newDecision`,
    defaultMessage: 'View draft',
  },
});

interface RemoveDecisionMessageProps {
  handleRedirect: () => void;
}

const RemoveDecisionMessage = ({
  handleRedirect,
}: RemoveDecisionMessageProps) => (
  <DialogSection>
    <Heading3
      appearance={{ theme: 'dark' }}
      text={MSG.title}
      textValues={{
        removeDraft: (
          <span className={styles.redTitle} key={nanoid()}>
            <FormattedMessage {...MSG.removeDraft} />
          </span>
        ),
      }}
    />
    <FormattedMessage
      {...MSG.description}
      values={{
        viewDraftBtn: (
          <Button
            text={MSG.viewDraft}
            appearance={{ theme: 'blue' }}
            onClick={handleRedirect}
          />
        ),
      }}
    />
  </DialogSection>
);

RemoveDecisionMessage.displayName = displayName;

export default RemoveDecisionMessage;
