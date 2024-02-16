import { Binoculars, FilePlus } from '@phosphor-icons/react';
import { motion } from 'framer-motion';
import React, { type FC } from 'react';
import { useSelector } from 'react-redux';

import { Action } from '~constants/actions.ts';
import { useActionSidebarContext } from '~context/ActionSidebarContext/index.tsx';
import { useAppContext } from '~context/AppContext.tsx';
import { useColonyContext } from '~context/ColonyContext.tsx';
import {
  useSetPageBreadcrumbs,
  useSetPageHeadingTitle,
} from '~context/PageHeadingContext/hooks.ts';
import { useCreateTeamBreadcrumbs } from '~hooks/useTeamsBreadcrumbs.ts';
import { getDraftDecisionFromStore } from '~utils/decisions.ts';
import { formatText } from '~utils/intl.ts';
import { ACTION_TYPE_FIELD_NAME } from '~v5/common/ActionSidebar/consts.tsx';
import EmptyContent from '~v5/common/EmptyContent/EmptyContent.tsx';
import Button from '~v5/shared/Button/Button.tsx';

import { useFiltersContext } from './FiltersContext/FiltersContext.tsx';
import { useGetAgreements } from './hooks.ts';
import AgreementCard from './partials/AgreementCard/index.ts';
import AgreementCardSkeleton from './partials/AgreementCardSkeleton.tsx';
import AgreementsPageFilters from './partials/AgreementsPageFilters/AgreementsPageFilters.tsx';
import DraftSection from './partials/DraftSection/DraftSection.tsx';

const displayName = 'v5.pages.AgreementsPage';

const AgreementsPage: FC = () => {
  const {
    colony: { colonyAddress },
  } = useColonyContext();
  const { user } = useAppContext();
  const teamsBreadcrumbs = useCreateTeamBreadcrumbs();
  const {
    actionSidebarToggle: [, { toggleOn: toggleActionSidebarOn }],
  } = useActionSidebarContext();

  useSetPageBreadcrumbs(teamsBreadcrumbs);
  useSetPageHeadingTitle(formatText({ id: 'agreementsPage.title' }));
  const { searchedAgreements, loading, loadingMotionStateFilter } =
    useGetAgreements();
  const { activeFilters } = useFiltersContext();
  const isFilterActive =
    !!activeFilters.dateFrom ||
    !!activeFilters.dateTo ||
    !!activeFilters.motionStates ||
    !!activeFilters.search;

  const draftAgreement = useSelector(
    getDraftDecisionFromStore(user?.walletAddress || '', colonyAddress),
  );

  return (
    <div>
      {draftAgreement && <DraftSection className="mb-6" />}
      <div className="sm:flex sm:items-center justify-between sm:flex-row flex-col mb-6">
        <div className="flex items-center gap-2 sm:mb-0 mb-2.5">
          <h4 className="heading-5">
            {formatText({ id: 'agreementsPage.subtitle' })}
          </h4>
        </div>
        <AgreementsPageFilters />
        <Button
          mode="primarySolid"
          size="medium"
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
      {loading || loadingMotionStateFilter ? (
        <ul className="grid sm:grid-cols-2 gap-6">
          {[...Array(4).keys()].map((key) => (
            <li
              key={key}
              className="w-full h-full flex flex-col pt-6 pb-5 px-5 rounded-lg border border-gray-200"
            >
              <AgreementCardSkeleton />
            </li>
          ))}
        </ul>
      ) : (
        <>
          {searchedAgreements && searchedAgreements?.length > 0 && (
            <ul className="grid auto-rows-fr sm:auto-rows-auto grid-cols-1 sm:grid-cols-2 gap-6">
              {searchedAgreements.map(({ transactionHash }) => (
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
          {searchedAgreements?.length === 0 &&
            !loading &&
            !loadingMotionStateFilter &&
            !isFilterActive && (
              <EmptyContent
                description={{ id: 'agreementsPage.empty.description' }}
                className="px-5 py-[5.75rem] border-dashed"
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
          {searchedAgreements?.length === 0 &&
            !loading &&
            !loadingMotionStateFilter &&
            isFilterActive && (
              <EmptyContent
                title={{ id: 'agreementsPage.empty.title.filter' }}
                description={{ id: 'agreementsPage.empty.description.filter' }}
                className="pt-10 pb-9 px-6"
                icon={Binoculars}
                withBorder
              />
            )}
        </>
      )}
    </div>
  );
};

AgreementsPage.displayName = displayName;

export default AgreementsPage;
