import { Browsers } from '@phosphor-icons/react';
import React, { type FC } from 'react';

import { useColonyContext } from '~context/ColonyContext.tsx';
import useColonyContractVersion from '~hooks/useColonyContractVersion.ts';
import { formatText } from '~utils/intl.ts';
import ActionFormRow from '~v5/common/ActionFormRow/index.ts';

const displayName = 'v5.common.ActionsContent.partials.ColonyVersionField';

const ColonyVersionField: FC = () => {
  const {
    colony: { version: currentVersion },
  } = useColonyContext();
  const { colonyContractVersion: newVersion } = useColonyContractVersion();

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
      >
        <span className="text-md">{currentVersion}</span>
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
      >
        <span className="text-md">{newVersion}</span>
      </ActionFormRow>
    </>
  );
};

ColonyVersionField.displayName = displayName;

export default ColonyVersionField;
