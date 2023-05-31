import React, { Fragment } from 'react';
import { useIntl } from 'react-intl';
import ExtensionStatusBadge from '~common/Extensions/ExtensionStatusBadge';
import Permissions from './partials/Permissions';
import DateInstalled from './partials/DateInstalled';
import InstalledBy from './partials/InstalledBy';
import Version from './partials/Version';
import ContractAddress from './partials/ContractAddress';
import Developer from './partials/Developer';
import styles from './SpecificSidePanel.module.css';
import { useSpecificSidePanel } from './hooks';

const displayName = 'common.Extensions.SpecificSidePanel';

const SpecificSidePanel = () => {
  const { formatMessage } = useIntl();
  const { statuses, sidePanelData } = useSpecificSidePanel();

  return (
    <div className="sm:w-full md:w-[17.625rem] lg:w-[20.4375rem] bg-base-white flex gap-[1.25rem] flex-col">
      <h3 className="font-semibold text-lg text-gray-900 pb-[0.2rem]">
        {formatMessage({ id: 'specific.side.panel.title' })}
      </h3>
      {(sidePanelData || [])?.map(
        ({ id, dateInstalled, installedBy, statusType, versionInstalled, contractAddress, developer, permissions }) => (
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
              <InstalledBy title={installedBy.title} component={installedBy.component} />
            )}
            {!statuses?.includes('not-installed') && (
              // @ts-ignore
              <DateInstalled title={dateInstalled.title} date={dateInstalled.date} />
            )}
            <Version title={versionInstalled.title} version={versionInstalled.version} />
            {!statuses?.includes('not-installed') && (
              <ContractAddress title={contractAddress.title} address={contractAddress.address} />
            )}
            <Developer title={developer.title} developer={developer.developer} />
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
