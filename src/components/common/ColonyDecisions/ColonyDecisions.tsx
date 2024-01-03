import React, { useState } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import { useSelector } from 'react-redux';

import { useColonyHomeContext } from '~context';
import { ModelSortDirection, useGetColonyDecisionsQuery } from '~gql';
import { useAppContext, useColonyContext, useEnabledExtensions } from '~hooks';
import LoadMoreButton from '~shared/LoadMoreButton/LoadMoreButton';
import { SpinnerLoader } from '~shared/Preloaders';
import { notNull } from '~utils/arrays';
import { getDraftDecisionFromStore } from '~utils/decisions';

import DecisionItem from './DecisionItem';
import DecisionListHeader from './DecisionListHeader';
import DraftDecisionItem from './DraftDecisionItem';

import styles from './ColonyDecisions.css';

const displayName = 'common.ColonyDecisions';

const ITEMS_PER_PAGE = 10;

const MSG = defineMessages({
  decisionsTitle: {
    id: `${displayName}.decisionsTitle`,
    defaultMessage: 'Decisions',
  },
  noDecisionsFound: {
    id: `${displayName}.noDecisionsFound`,
    defaultMessage: 'No decisions exist',
  },
  loading: {
    id: `${displayName}.loading`,
    defaultMessage: 'Loading Decisions',
  },
  installExtension: {
    id: `${displayName}.installExtension`,
    defaultMessage: `You need to install the Governance extension to use the Decisions feature.`,
  },
});

const ColonyDecisions = () => {
  const { colony } = useColonyContext();
  const { domainIdFilter: domainId } = useColonyHomeContext();

  const [sortDirection, setSortDirection] = useState<ModelSortDirection>(
    ModelSortDirection.Desc,
  );
  const [page, setPage] = useState<number>(1);

  const { isVotingReputationEnabled, loading: isLoadingExtensions } =
    useEnabledExtensions();
  const { user } = useAppContext();

  const draftDecision = useSelector(
    getDraftDecisionFromStore(
      user?.walletAddress || '',
      colony?.colonyAddress ?? '',
    ),
  );

  const filter: {
    showInDecisionsList: { eq: boolean };
    motionDomainId?: { eq: number };
  } = {
    showInDecisionsList: { eq: true },
  };

  if (domainId) {
    filter.motionDomainId = { eq: domainId };
  }

  const { data, loading: isLoadingDecisions } = useGetColonyDecisionsQuery({
    variables: {
      colonyAddress: colony?.colonyAddress ?? '',
      sortDirection,
      filter,
      limit: page * ITEMS_PER_PAGE,
    },
    fetchPolicy: 'cache-and-network',
  });

  const decisions =
    data?.getColonyDecisionByColonyAddress?.items.filter(notNull);

  if (isLoadingDecisions) {
    return (
      <div className={styles.loadingSpinner}>
        <SpinnerLoader
          loadingText={MSG.loading}
          appearance={{ theme: 'primary', size: 'massive' }}
        />
      </div>
    );
  }

  if (!isVotingReputationEnabled && !isLoadingExtensions) {
    return (
      <div className={styles.installExtension}>
        <FormattedMessage {...MSG.installExtension} />
      </div>
    );
  }

  return (
    <div>
      <DecisionListHeader
        sortDirection={sortDirection}
        setSortDirection={setSortDirection}
      />
      {decisions?.length ? (
        <ul>
          {draftDecision && <DraftDecisionItem draftDecision={draftDecision} />}
          {decisions.map((decisionData) => (
            <DecisionItem decision={decisionData} key={decisionData.actionId} />
          ))}
        </ul>
      ) : (
        !isLoadingDecisions && (
          <div className={styles.draftDecisionContainer}>
            {draftDecision && (
              <DraftDecisionItem draftDecision={draftDecision} />
            )}
            <div className={styles.emptyState}>
              <FormattedMessage {...MSG.noDecisionsFound} />
            </div>
          </div>
        )
      )}

      {data?.getColonyDecisionByColonyAddress?.nextToken && (
        <LoadMoreButton
          onClick={() => setPage((pg) => pg + 1)}
          isLoadingData={isLoadingDecisions}
        />
      )}
    </div>
  );
};

export default ColonyDecisions;
