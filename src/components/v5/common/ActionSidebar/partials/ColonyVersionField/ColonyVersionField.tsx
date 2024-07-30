import { Browsers } from '@phosphor-icons/react';
import clsx from 'clsx';
import React, { type FC } from 'react';

import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
import useColonyContractVersion from '~hooks/useColonyContractVersion.ts';
import { formatText } from '~utils/intl.ts';
import ActionFormRow from '~v5/common/ActionFormRow/index.ts';
import useHasNoDecisionMethods from '~v5/common/ActionSidebar/hooks/permissions/useHasNoDecisionMethods.ts';

const displayName = 'v5.common.ActionsContent.partials.ColonyVersionField';

const ColonyVersionField: FC = () => {
  const {
    colony: { version: currentVersion },
  } = useColonyContext();
  const { colonyContractVersion: newVersion } = useColonyContractVersion();

  const hasNoDecisionMethods = useHasNoDecisionMethods();

  return (
    <>
      <ActionFormRow
        icon={Browsers}
        title={formatText({ id: 'actionSidebar.currentVersion' })}
        tooltips={{
          label: {
            tooltipContent: formatText({
              id: 'actionSidebar.tooltip.upgradeColonyVersion.currentVersion',
            }),
          },
        }}
        isDisabled={hasNoDecisionMethods}
      >
        <span
          className={clsx('text-md', { 'text-gray-300': hasNoDecisionMethods })}
        >
          {currentVersion}
        </span>
      </ActionFormRow>
      <ActionFormRow
        icon={Browsers}
        title={formatText({ id: 'actionSidebar.newVersion' })}
        tooltips={{
          label: {
            tooltipContent: formatText({
              id: 'actionSidebar.tooltip.upgradeColonyVersion.newVersion',
            }),
          },
        }}
        isDisabled={hasNoDecisionMethods}
      >
        <span
          className={clsx('text-md', { 'text-gray-300': hasNoDecisionMethods })}
        >
          {newVersion}
        </span>
      </ActionFormRow>
    </>
  );
};

ColonyVersionField.displayName = displayName;

export default ColonyVersionField;
