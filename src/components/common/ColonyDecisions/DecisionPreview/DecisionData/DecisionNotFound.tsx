import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import Button from '~shared/Button';

import styles from './DecisionNotFound.css';

const displayName = 'common.ColonyDecisions.DecisionPreview.DecisionNotFound';

const MSG = defineMessages({
  noDecisionText: {
    id: `${displayName}.noDecisionText`,
    defaultMessage: 'No draft Decision found. ',
  },
  createDecision: {
    id: `${displayName}.createDecision`,
    defaultMessage: 'Create a new Decision',
  },
});

const DecisionNotFound = () => (
  <div className={styles.noContent}>
    <FormattedMessage {...MSG.noDecisionText} />
    <Button
      text={MSG.createDecision}
      appearance={{ theme: 'blue' }}
      onClick={
        () => console.log('Implement create decision...')
        // openDecisionDialog({
        //   ethDomainId: Id.RootDomain,
        // })
      }
    />
  </div>
);

DecisionNotFound.displayName = displayName;

export default DecisionNotFound;
