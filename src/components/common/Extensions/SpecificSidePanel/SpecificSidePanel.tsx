import React, { type FC, Fragment } from 'react';
import { useIntl } from 'react-intl';

import { getRole } from '~constants/permissions.ts';
import { formatText } from '~utils/intl.ts';
import ExtensionStatusBadge from '~v5/common/Pills/ExtensionStatusBadge/index.ts';
import RolesTooltip from '~v5/shared/RolesTooltip/RolesTooltip.tsx';

import { useSpecificSidePanel } from './hooks.tsx';
import ContractAddress from './partials/ContractAddress.tsx';
import InstalledBy from './partials/InstalledBy.tsx';
import SpecificSidePanelRow from './partials/SpecificSidePanelRow.tsx';
import specificSidePanelClasses from './SpecifcSidePanel.styles.ts';
import { type SpecificSidePanelProps } from './types.ts';

const displayName = 'common.Extensions.SpecificSidePanel';

const SpecificSidePanel: FC<SpecificSidePanelProps> = ({ extensionData }) => {
  const { formatMessage } = useIntl();
  const { badgeMessages, statuses, sidePanelData } =
    useSpecificSidePanel(extensionData);

  return (
    <div className="flex flex-col gap-2">
      <h3 className="-mb-0.5 heading-5">
        {formatMessage({ id: 'specific.side.panel.title' })}
      </h3>
      {(sidePanelData || [])?.map(
        ({
          id,
          dateInstalled,
          installedBy,
          statusType,
          dateCreated,
          latestVersion,
          versionInstalled,
          contractAddress,
          developer,
          permissions,
        }) => (
          <Fragment key={id}>
            <div className={specificSidePanelClasses.panelRow}>
              <div className={specificSidePanelClasses.panelTitle}>
                {statusType.title}
              </div>
              <div className="flex flex-col justify-start gap-y-2 md:flex-row md:flex-wrap">
                <div className="flex flex-wrap gap-1">
                  {statuses.map((status) => (
                    <ExtensionStatusBadge
                      key={status}
                      mode={status}
                      text={formatMessage(badgeMessages[status])}
                    />
                  ))}
                </div>
              </div>
            </div>
            {!statuses?.includes('not-installed') && (
              <InstalledBy
                title={installedBy.title}
                extensionData={extensionData}
              />
            )}
            {statuses?.includes('not-installed') ? (
              <SpecificSidePanelRow
                title={dateCreated?.title}
                description={dateCreated.date || ''}
              />
            ) : (
              <SpecificSidePanelRow
                title={dateInstalled?.title}
                description={dateInstalled.date || ''}
              />
            )}
            {statuses?.includes('not-installed') ? (
              <SpecificSidePanelRow
                title={latestVersion.title}
                description={latestVersion.version}
              />
            ) : (
              <SpecificSidePanelRow
                title={versionInstalled.title}
                description={versionInstalled.version}
              />
            )}
            {!statuses?.includes('not-installed') && (
              <ContractAddress
                title={contractAddress.title}
                description={contractAddress.address}
              />
            )}
            <SpecificSidePanelRow
              title={developer.title}
              description={developer.developer}
            />
            <div className={specificSidePanelClasses.panelRow}>
              <div className={specificSidePanelClasses.panelTitle}>
                {formatText({ id: 'extensionsPage.permission' })}
              </div>
              <RolesTooltip role={getRole(permissions)} />
            </div>
          </Fragment>
        ),
      )}
    </div>
  );
};

SpecificSidePanel.displayName = displayName;

export default SpecificSidePanel;
