import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import { Id } from '@colony/colony-js';

import Button from '~shared/Button';
import { useDialog } from '~shared/Dialog';
import { DecisionDialog } from '~common/ColonyDecisions';

import { useColonyContext, useEnabledExtensions } from '~hooks';

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
  installExtension: {
    id: `${displayName}.installExtension`,
    defaultMessage: `You need to install the Governance extension to use the Decisions feature.`,
  },
});

const DecisionNotFound = () => {
  const openDecisionDialog = useDialog(DecisionDialog);
  const { colony } = useColonyContext();
  const { isVotingReputationEnabled } = useEnabledExtensions();

  if (!isVotingReputationEnabled) {
    return <FormattedMessage {...MSG.installExtension} />;
  }

  return (
    <>
      <FormattedMessage {...MSG.noDecisionText} />
      <Button
        text={MSG.createDecision}
        appearance={{ theme: 'blue' }}
        onClick={() => {
          openDecisionDialog({
            nativeDomainId: Id.RootDomain,
            colonyAddress: colony?.colonyAddress ?? '',
          });
        }}
      />
    </>
  );
};

DecisionNotFound.displayName = displayName;

export default DecisionNotFound;
