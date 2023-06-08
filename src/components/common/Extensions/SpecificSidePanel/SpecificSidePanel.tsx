import React, { FC, Fragment } from 'react';
import { useIntl } from 'react-intl';

import ExtensionStatusBadge from '~common/Extensions/ExtensionStatusBadge';
import Permissions from './partials/Permissions';
import InstalledBy from './partials/InstalledBy';
import ContractAddress from './partials/ContractAddress';
import styles from './SpecificSidePanel.module.css';
import { useSpecificSidePanel } from './hooks';
import { SpecificSidePanelProps } from './types';
import SpecificSidePanelRow from './partials/SpecificSidePanelRow';

const displayName = 'common.Extensions.SpecificSidePanel';

const SpecificSidePanel: FC<SpecificSidePanelProps> = ({ extensionData }) => {
  const { formatMessage } = useIntl();
  const { statuses, sidePanelData } = useSpecificSidePanel(extensionData);

  return (
    <div className="bg-base-white flex gap-[1.25rem] flex-col">
      <h3 className="font-semibold text-lg text-gray-900 pb-[0.2rem]">
        {formatMessage({ id: 'specific.side.panel.title' })}
      </h3>
      {(sidePanelData || [])?.map(
        ({
          id,
          dateInstalled,
          installedBy,
          dateCreated,
          statusType,
          latestVersion,
          versionInstalled,
          contractAddress,
          developer,
          permissions,
        }) => (
          <Fragment key={id}>
            <div className={styles.panelRow}>
              <div className={styles.panelTitle}>{statusType.title}</div>
              <div className="md:w-[50%] justify-start flex flex-col md:flex-row">
                {Array.isArray(statuses) ? (
                  statuses.map((status) => (
                    <div className="mr-1 mb-1 md:mb-0" key={status}>
                      <ExtensionStatusBadge mode={status} text={status} />
                    </div>
                  ))
                ) : (
                  <ExtensionStatusBadge mode={statuses} text={statuses} />
                )}
              </div>
            </div>
            {!statuses?.includes('not-installed') && (
              <InstalledBy title={installedBy.title} extensionData={extensionData} />
            )}
            {statuses?.includes('not-installed') ? (
              <SpecificSidePanelRow title={dateCreated?.title} description={dateCreated.date || ''} />
            ) : (
              <SpecificSidePanelRow title={dateInstalled?.title} description={dateInstalled.date || ''} />
            )}
            {statuses?.includes('not-installed') ? (
              <SpecificSidePanelRow title={latestVersion.title} description={latestVersion.version} />
            ) : (
              <SpecificSidePanelRow title={versionInstalled.title} description={versionInstalled.version} />
            )}
            {!statuses?.includes('not-installed') && (
              <ContractAddress title={contractAddress.title} description={contractAddress.address} />
            )}
            <SpecificSidePanelRow title={developer.title} description={developer.developer} />
            <div className="flex flex-col justify-between">
              <div className="font-normal text-sm text-gray-600 pb-[0.875rem]">{permissions.title}</div>
              <Permissions data={permissions.permissions} />
            </div>
          </Fragment>
        ),
      )}
    </div>
  );
};

SpecificSidePanel.displayName = displayName;

export default SpecificSidePanel;
