/* eslint-disable no-lone-blocks */
// import { Plus } from '@phosphor-icons/react';
import React from 'react';

// import { Action } from '~constants/actions.ts';
// import { useActionSidebarContext } from '~context/ActionSidebarContext/ActionSidebarContext.ts';
import { useSubDomains } from '~hooks/useSubDomains.ts';
import { notMaybe } from '~utils/arrays/index.ts';
// import { formatText } from '~utils/intl.ts';
// import { ACTION_TYPE_FIELD_NAME } from '~v5/common/ActionSidebar/consts.ts';
import { getDomainNameFallback } from '~utils/domains.ts';
import WidgetCards from '~v5/common/WidgetCards/index.ts';

// import { useIsAddNewTeamVisible } from './hooks.ts';
import { FundsCardsItem } from './partials/FundsCardsItem.tsx';
import { FundsCardsTotalItem } from './partials/FundsCardsTotalItem.tsx';

{
  /* @TODO: New team card disabled temporarily until an accessibility audit is completed on this component */
}

export const FundsCards = () => {
  // const {
  //   actionSidebarToggle: [, { toggleOn: toggleActionSidebarOn }],
  // } = useActionSidebarContext();

  // const onNewTeamClick = () => {
  //   toggleActionSidebarOn({
  //     [ACTION_TYPE_FIELD_NAME]: Action.CreateNewTeam,
  //   });
  // };

  const subTeams = useSubDomains();

  // const isAddNewTeamVisible = useIsAddNewTeamVisible();
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:gap-2 md:pt-1">
      <WidgetCards.List className="w-full">
        <FundsCardsTotalItem />
        {subTeams?.filter(notMaybe).map((item) => (
          <FundsCardsItem
            key={item?.id}
            domainId={item?.id}
            domainName={getDomainNameFallback({
              domainName: item?.metadata?.name,
              nativeId: item.nativeId,
            })}
            nativeId={item.nativeId}
          />
        ))}

        {/* {isAddNewTeamVisible && (
          <WidgetCards.Item
            variant="dashed"
            icon={Plus}
            title={
              <div className="text-xs">
                {formatText({ id: 'dashboard.team.cards.createTeam' })}
              </div>
            }
            onClick={onNewTeamClick}
            className="justify-center uppercase text-gray-200"
          />
        )} */}
      </WidgetCards.List>
    </div>
  );
};
