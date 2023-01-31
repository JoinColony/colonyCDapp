import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import { useSelector } from 'react-redux';

import { SpinnerLoader } from '~shared/Preloaders';
import { useAppContext } from '~hooks';
import { getDecisionFromStore } from '~utils/decisions';

// import { SortOptions } from './constants';
import DraftDecisionItem from './DraftDecisionItem';

import styles from './ColonyDecisions.css';

const displayName = 'common.ColonyDecisions';

const MSG = defineMessages({
  decisionsTitle: {
    id: `${displayName}.decisionsTitle`,
    defaultMessage: 'Decisions',
  },
  labelFilter: {
    id: `${displayName}.labelFilter`,
    defaultMessage: 'Filter',
  },
  placeholderFilter: {
    id: `${displayName}.placeholderFilter`,
    defaultMessage: 'Filter',
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

// type Props = {
//   //ethDomainId: number;
// };

// const ITEMS_PER_PAGE = 10;

const ColonyDecisions = () => {
  // const { colonyName } = useParams();
  // const [dataPage, setDataPage] = useState<number>(1);
  const { walletConnecting, userLoading, user } = useAppContext();
  const decision = useSelector(getDecisionFromStore(user?.walletAddress || ''));

  // const navigate = useNavigate();
  // const handleActionRedirect = ({ transactionHash }: RedirectHandlerProps) =>
  //   navigate(`/colony/${colonyName}/decisions/tx/${transactionHash}`);

  //   const [sortOption, setSortOption] = useState<string>(
  //     SortOptions.ENDING_SOONEST,
  //   );

  //   const { isVotingExtensionEnabled, isLoadingExtensions } =
  //     useEnabledExtensions({
  //       colonyAddress,
  //     });

  //   const { data: extensions } = useColonyExtensionsQuery({
  //     variables: { address: colonyAddress },
  //   });
  //   const { installedExtensions } = extensions?.processedColony || {};
  //   const votingReputationExtension = installedExtensions?.find(
  //     ({ extensionId }) => extensionId === Extension.VotingReputation,
  //   );

  //   const { data: motions, loading: decisionsLoading } =
  //     useSubgraphDecisionsSubscription({
  //       variables: {
  //         /*
  //          * @NOTE We always need to fetch one more item so that we know that more
  //          * items exist and we show the "load more" button
  //          */
  //         colonyAddress: colonyAddress?.toLowerCase() || '',
  //         extensionAddress:
  //           votingReputationExtension?.address?.toLowerCase() || '',
  //       },
  //     });

  //   const decisions = useTransformer(getActionsListData, [
  //     installedExtensions?.map(({ address }) => address) as string[],
  //     { ...motions },
  //     undefined,
  //     {},
  //   ]);

  //   const filteredDecisions = useMemo(
  //     () =>
  //       !ethDomainId || ethDomainId === ROOT_DOMAIN_ID
  //         ? decisions
  //         : decisions?.filter(
  //             (decision) =>
  //               decision.toDomain === ethDomainId.toString() ||
  //               decision.fromDomain === ethDomainId.toString() ||
  //               /* when no specific domain in the action it is displayed in Root */
  //               (ethDomainId === ROOT_DOMAIN_ID &&
  //                 decision.fromDomain === undefined),
  //           ),
  //     [ethDomainId, decisions],
  //   );

  //   const sortedDecisions = useMemo(
  //     () =>
  //       filteredDecisions.sort((first, second) =>
  //         sortOption === SortOptions.ENDING_SOONEST
  //           ? first.createdAt.getTime() - second.createdAt.getTime()
  //           : second.createdAt.getTime() - first.createdAt.getTime(),
  //       ),
  //     [sortOption, filteredDecisions],
  //   );

  //   const paginatedDecisions = sortedDecisions.slice(
  //     0,
  //     ITEMS_PER_PAGE * dataPage,
  //   );

  // @TODO: Replace with query loading state.
  const decisionsLoading = walletConnecting || userLoading;
  if (decisionsLoading) {
    return (
      <div className={styles.loadingSpinner}>
        <SpinnerLoader
          loadingText={MSG.loading}
          appearance={{ theme: 'primary', size: 'massive' }}
        />
      </div>
    );
  }

  //   if (!isVotingExtensionEnabled && !isLoadingExtensions) {
  //     return (
  //       <div className={styles.installExtension}>
  //         <FormattedMessage {...MSG.installExtension} />
  //       </div>
  //     );
  //   }

  return (
    <div>
      {
        /* {sortedDecisions.length > 0 ? (
        <>
          <div className={styles.bar}>
            <div className={styles.title}>
              <FormattedMessage {...MSG.decisionsTitle} />
            </div>
            <Form
              initialValues={{ filter: SortOptions.ENDING_SOONEST }}
              onSubmit={() => undefined}
            >
              <div className={styles.filter}>
                <Select
                  appearance={{
                    alignOptions: 'left',
                    theme: 'alt',
                    unrestrictedOptionsWidth: 'true',
                  }}
                  elementOnly
                  label={MSG.labelFilter}
                  name="filter"
                  options={SortSelectOptions}
                  placeholder={MSG.placeholderFilter}
                  onChange={setSortOption}
                />
              </div>
            </Form>
          </div>
          <ActionsList
            items={paginatedDecisions}
            handleItemClick={handleActionRedirect}
            colony={colony}
          />
          {ITEMS_PER_PAGE * dataPage < decisions?.length && (
            <LoadMoreButton
              onClick={() => setDataPage(dataPage + 1)}
              isLoadingData={decisionsLoading}
            />
          )}
        </> }
      ) : ( */
        !decisionsLoading && (
          /* isVotingExtensionEnabled && */
          <div className={styles.draftDecisionContainer}>
            {decision && <DraftDecisionItem decision={decision} />}
            <div className={styles.emptyState}>
              <FormattedMessage {...MSG.noDecisionsFound} />
            </div>
          </div>
        )
      }
    </div>
  );
};

export default ColonyDecisions;
