import React, { FC, Fragment } from 'react';
import { useIntl } from 'react-intl';

import { getRole } from '~constants/permissions';
import { formatText } from '~utils/intl';
import ExtensionStatusBadge from '~v5/common/Pills/ExtensionStatusBadge';
import RolesTooltip from '~v5/shared/RolesTooltip';

import { useSpecificSidePanel } from './hooks';
import ContractAddress from './partials/ContractAddress';
import InstalledBy from './partials/InstalledBy';
import SpecificSidePanelRow from './partials/SpecificSidePanelRow';
import { SpecificSidePanelProps } from './types';

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
            <div className="flex flex-col justify-between">
              <div className="font-normal text-sm text-gray-600 pb-[0.875rem]">
                {formatText({ id: 'extensionsPage.permissions' })}
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
