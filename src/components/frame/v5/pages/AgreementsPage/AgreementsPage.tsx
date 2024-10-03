import { Binoculars, FilePlus } from '@phosphor-icons/react';
import { motion } from 'framer-motion';
import React, { type FC } from 'react';

import { Action } from '~constants/actions.ts';
import { useActionSidebarContext } from '~context/ActionSidebarContext/ActionSidebarContext.ts';
import { useAppContext } from '~context/AppContext/AppContext.ts';
import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
import { useSetPageHeadingTitle } from '~context/PageHeadingContext/PageHeadingContext.ts';
import { getDraftDecisionFromLocalStorage } from '~utils/decisions.ts';
import { formatText } from '~utils/intl.ts';
import { ACTION_TYPE_FIELD_NAME } from '~v5/common/ActionSidebar/consts.ts';
import EmptyContent from '~v5/common/EmptyContent/EmptyContent.tsx';
import ContentWithTeamFilter from '~v5/frame/ContentWithTeamFilter/ContentWithTeamFilter.tsx';
import Button from '~v5/shared/Button/Button.tsx';

import { useFiltersContext } from './FiltersContext/FiltersContext.ts';
import { useGetAgreements } from './hooks.ts';
import AgreementCard from './partials/AgreementCard/index.ts';
import AgreementCardSkeleton from './partials/AgreementCardSkeleton.tsx';
import AgreementsPageFilters from './partials/AgreementsPageFilters/AgreementsPageFilters.tsx';
import DraftSection from './partials/DraftSection/DraftSection.tsx';
import { sortAgreementsByDate } from './utils.ts';

const displayName = 'v5.pages.AgreementsPage';

const AgreementsPage: FC = () => {
  const {
    colony: { colonyAddress },
  } = useColonyContext();
  const { user } = useAppContext();
  const {
    actionSidebarToggle: [, { toggleOn: toggleActionSidebarOn }],
  } = useActionSidebarContext();

  useSetPageHeadingTitle(formatText({ id: 'agreementsPage.title' }));
  const { searchedAgreements, loading, loadingMotionStateFilter } =
    useGetAgreements();
  const { activeFilters } = useFiltersContext();
  const isFilterActive =
    !!activeFilters.dateFrom ||
    !!activeFilters.dateTo ||
    !!activeFilters.motionStates ||
    !!activeFilters.search;

  const draftAgreement = getDraftDecisionFromLocalStorage(
    user?.walletAddress || '',
    colonyAddress,
  );

  const passedAgreements = searchedAgreements.filter(
    (agreement) => agreement.showInActionsList,
  );

  const notPassedAgreements = searchedAgreements.filter(
    (agreement) =>
      agreement.initiatorUser?.walletAddress === user?.walletAddress &&
      !agreement.showInActionsList,
  );

  const allAgreements =
    notPassedAgreements.length > 0
      ? [...notPassedAgreements, ...passedAgreements]
      : [...passedAgreements];

  const sortedAgreeements = sortAgreementsByDate(allAgreements);

  return (
    <ContentWithTeamFilter>
      {draftAgreement && <DraftSection className="mb-6" />}
      <div className="mb-6 flex-col justify-between sm:flex sm:flex-row sm:items-center">
        <div className="mb-2.5 flex items-center gap-2 sm:mb-0">
          <h4 className="heading-5">
            {formatText({ id: 'agreementsPage.subtitle' })}
          </h4>
        </div>
        <div className="flex items-center gap-2">
          <AgreementsPageFilters />
          <Button
            mode="primarySolid"
            size="small"
            isFullSize={false}
            onClick={() => {
              toggleActionSidebarOn({
                [ACTION_TYPE_FIELD_NAME]: Action.CreateDecision,
              });
            }}
          >
            {formatText({ id: 'agreementsPage.createAgreement' })}
          </Button>
        </div>
      </div>
      {loading || loadingMotionStateFilter ? (
        <ul className="grid gap-6 sm:grid-cols-2">
          {[...Array(4).keys()].map((key) => (
            <li
              key={key}
              className="flex h-full w-full flex-col rounded-lg border border-gray-200 px-5 pb-5 pt-6"
            >
              <AgreementCardSkeleton />
            </li>
          ))}
        </ul>
      ) : (
        <>
          {allAgreements && allAgreements?.length > 0 && (
            <ul className="grid auto-rows-fr grid-cols-1 gap-6 sm:auto-rows-auto sm:grid-cols-2">
              {sortedAgreeements.map(({ transactionHash }) => (
                <motion.li
                  initial={{ opacity: 0 }}
                  whileInView={{
                    opacity: 1,
                    transition: {
                      duration: 0.75,
                    },
                  }}
                  viewport={{ once: true }}
                  key={transactionHash}
                  className="w-full"
                >
                  <AgreementCard transactionId={transactionHash} />
                </motion.li>
              ))}
            </ul>
          )}
          {allAgreements?.length === 0 &&
            !loading &&
            !loadingMotionStateFilter &&
            !isFilterActive && (
              <EmptyContent
                description={{ id: 'agreementsPage.empty.description' }}
                className="border-dashed px-5 py-[5.75rem]"
                buttonText={{ id: 'agreementsPage.empty.button' }}
                onClick={() => {
                  toggleActionSidebarOn({
                    [ACTION_TYPE_FIELD_NAME]: Action.CreateDecision,
                  });
                }}
                buttonIcon={FilePlus}
                withBorder
              />
            )}
          {allAgreements?.length === 0 &&
            !loading &&
            !loadingMotionStateFilter &&
            isFilterActive && (
              <EmptyContent
                title={{ id: 'agreementsPage.empty.title.filter' }}
                description={{ id: 'agreementsPage.empty.description.filter' }}
                className="px-6 pb-9 pt-10"
                icon={Binoculars}
                withBorder
              />
            )}
        </>
      )}
    </ContentWithTeamFilter>
  );
};

AgreementsPage.displayName = displayName;

export default AgreementsPage;
