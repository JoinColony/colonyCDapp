import clsx from 'clsx';
import React from 'react';

import { ACTION } from '~constants/actions';
import { useActionSidebarContext } from '~context/ActionSidebarContext';
import { COLONY_AGREEMENTS_ROUTE } from '~routes';
import { formatText } from '~utils/intl';
import { ACTION_TYPE_FIELD_NAME } from '~v5/common/ActionSidebar/consts';
import WidgetBox from '~v5/common/WidgetBox';
import EmptyWidgetState from '~v5/common/WidgetBox/partials';
import MessageNumber from '~v5/shared/MessageNumber';
import TitleWithNumber from '~v5/shared/TitleWithNumber';

const displayName = 'common.ColonyHome.TotalActions';

const Agreements = () => {
  const agreements = undefined;

  const {
    actionSidebarToggle: [, { toggleOn: toggleActionSidebarOn }],
  } = useActionSidebarContext();

  const openCreateDecision = () => {
    toggleActionSidebarOn({
      [ACTION_TYPE_FIELD_NAME]: ACTION.CREATE_DECISION,
    });
  };

  return (
    <WidgetBox
      title={
        <TitleWithNumber
          title={formatText({
            id: 'dashboard.agreements.widget.title',
          })}
          number={0}
          className={clsx('transition-all', {
            'sm:hover:text-blue-400': agreements,
          })}
        />
      }
      titleClassName="text-2 mb-4"
      value={
        agreements ? (
          <div className="flex flex-col gap-[.375rem]">
            <div className="flex items-start justify-between gap-2">
              <span className="text-3">{agreements}</span>
              <MessageNumber message={1} />
            </div>
            <p className="text-sm text-gray-600 line-clamp-3">{agreements}</p>
          </div>
        ) : (
          <EmptyWidgetState
            title={formatText({
              id: 'dashboard.agreements.widget.noData',
            })}
            actionTitle={formatText({
              id: 'dashboard.agreements.widget.createObjective',
            })}
            className="px-[1.8rem] py-[1.2rem]"
            onClick={openCreateDecision}
          />
        )
      }
      contentClassName="w-full"
      className="flex-col p-6 bg-base-white min-h-[11.25rem]"
      href={agreements ? COLONY_AGREEMENTS_ROUTE : undefined}
    />
  );
};

Agreements.displayName = displayName;
export default Agreements;
