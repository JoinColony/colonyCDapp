import React, { FC, Fragment } from 'react';
import { useIntl } from 'react-intl';

import { getRole } from '~constants/permissions.ts';
import { formatText } from '~utils/intl.ts';
import ExtensionStatusBadge from '~v5/common/Pills/ExtensionStatusBadge/index.ts';
import RolesTooltip from '~v5/shared/RolesTooltip/RolesTooltip.tsx';

import { useSpecificSidePanel } from './hooks.tsx';
import ContractAddress from './partials/ContractAddress.tsx';
import InstalledBy from './partials/InstalledBy.tsx';
import SpecificSidePanelRow from './partials/SpecificSidePanelRow.tsx';
import { SpecificSidePanelProps } from './types.ts';

import styles from './SpecificSidePanel.module.css';

const displayName = 'common.Extensions.SpecificSidePanel';

const SpecificSidePanel: FC<SpecificSidePanelProps> = ({ extensionData }) => {
  const { formatMessage } = useIntl();
  const { statuses, sidePanelData } = useSpecificSidePanel(extensionData);

  return (
    <div className="flex gap-4 flex-col">
      <h3 className="heading-5 -mb-0.5">
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
            <div className={styles.panelRow}>
              <div className={styles.panelTitle}>{statusType.title}</div>
              <div className="flex justify-start flex-col gap-y-2 md:flex-row md:flex-wrap">
                {statuses.map((status) => (
                  <div key={status} className="flex flex-wrap gap-2">
                    <ExtensionStatusBadge mode={status} text={status} />
                  </div>
                ))}
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
            <div className={styles.panelRow}>
              <div className={styles.panelTitle}>
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
