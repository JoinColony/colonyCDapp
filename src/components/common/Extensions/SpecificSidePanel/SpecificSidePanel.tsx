import React, { FC, Fragment } from 'react';
import { useIntl } from 'react-intl';
import { SpecificSidePanelProps } from './types';
import ExtensionStatusBadge from '../ExtensionStatusBadge-new/ExtensionStatusBadge';
import Permissions from './partials/Permissions';
import DateInstalled from './partials/DateInstalled';
import InstaledBy from './partials/InstaledBy';
import Version from './partials/Version';
import ContractAddress from './partials/ContractAddress';
import Developer from './partials/Developer';
import styles from './SpecificSidePanel.module.css';

const displayName = 'common.Extensions.SpecificSidePanel';

const SpecificSidePanel: FC<SpecificSidePanelProps> = ({ statuses, sidepanelData }) => {
  const { formatMessage } = useIntl();

  return (
    <div className="sm:w-[23.75rem] md:w-[17.625rem] lg:w-[20.4375rem] bg-base-white">
      <h3 className="font-semibold text-lg text-gray-900 pb-[1.375rem]">
        {formatMessage({ id: 'specific.side.panel.title' })}
      </h3>
      {sidepanelData.map(
        ({ id, dateInstalled, instaledBy, statusType, versionInstalled, contractAddress, developer, permissions }) => (
          <Fragment key={id}>
            <div className={styles.panelRow}>
              <div className={styles.panelTitle}>{statusType.title}</div>
              <div className="w-[50%] justify-start flex flex-row">
                {statuses?.map((status) => (
                  <div className="mr-1" key={status}>
                    <ExtensionStatusBadge mode={status} text={status} />
                  </div>
                ))}
              </div>
            </div>
            {!statuses?.includes('not-installed') && (
              <InstaledBy title={instaledBy.title} component={instaledBy.component} />
            )}
            <DateInstalled title={dateInstalled.title} date={dateInstalled.date} />
            <Version title={versionInstalled.title} version={versionInstalled.version} />
            {!statuses?.includes('not-installed') && (
              <ContractAddress title={contractAddress.title} address={contractAddress.address} />
            )}
            <Developer title={developer.title} developer={developer.developer} />
            <div className="flex flex-col justify-between">
              <div className="font-normal text-sm text-gray-600 pb-[0.875rem] pt-[0.625rem]">{permissions.title}</div>
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
