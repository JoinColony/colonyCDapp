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
    defaultMessage:
      'No draft Decision found. <button>Create a new Decision</button>',
  },
  installExtension: {
    id: `${displayName}.installExtension`,
    defaultMessage: `You need to install the Governance extension to use the Decisions feature.`,
  },
});

const createNewDecisionMsgValues = (handleClick: () => void) => ({
  button: (...chunks: any[]) => (
    <Button
      text={chunks.join('')}
      appearance={{ theme: 'blue' }}
      onClick={handleClick}
    />
  ),
});

const DecisionNotFound = () => {
  const openDecisionDialog = useDialog(DecisionDialog);
  const { colony } = useColonyContext();
  const { isVotingReputationEnabled } = useEnabledExtensions();

  const handleClick = () => {
    openDecisionDialog({
      nativeDomainId: Id.RootDomain,
      colonyAddress: colony?.colonyAddress ?? '',
    });
  };

  return isVotingReputationEnabled ? (
    <div>
      <FormattedMessage
        {...MSG.noDecisionText}
        values={createNewDecisionMsgValues(handleClick)}
      />
    </div>
  ) : (
    <FormattedMessage {...MSG.installExtension} />
  );
};

DecisionNotFound.displayName = displayName;

export default DecisionNotFound;
