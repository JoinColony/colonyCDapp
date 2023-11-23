import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import { Extension, Id } from '@colony/colony-js';
import { Link } from 'react-router-dom';

import Button from '~shared/Button';
import { useDialog } from '~shared/Dialog';
import { DecisionDialog } from '~common/ColonyDecisions';

import { useColonyContext, useEnabledExtensions } from '~hooks';
import { COLONY_EXTENSIONS_ROUTE } from '~routes';

import styles from './DecisionNotFound.css';

const displayName = 'common.ColonyDecisions.DecisionPreview.DecisionNotFound';

const MSG = defineMessages({
  noDecisionText: {
    id: `${displayName}.noDecisionText`,
    defaultMessage:
      'No draft Decision found. <button>Create a new Decision</button>',
  },
  installExtension: {
    id: `${displayName}.installExtension`,
    defaultMessage: `You need to install the <link>Governance extension</link> to use the Decisions feature.`,
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

const extensionLinkMsgValues = (colonyName: string) => {
  return {
    link: (...chunks: any[]) => (
      <span className={styles.governanceLink}>
        <Link
          to={`/${colonyName}/${COLONY_EXTENSIONS_ROUTE}/${Extension.VotingReputation}`}
        >
          {chunks}
        </Link>
      </span>
    ),
  };
};

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

  return (
    <div>
      {isVotingReputationEnabled ? (
        <FormattedMessage
          {...MSG.noDecisionText}
          values={createNewDecisionMsgValues(handleClick)}
        />
      ) : (
        <FormattedMessage
          {...MSG.installExtension}
          values={extensionLinkMsgValues(colony?.name ?? '')}
        />
      )}
    </div>
  );
};

DecisionNotFound.displayName = displayName;

export default DecisionNotFound;
