import React, { FC } from 'react';
import { useIntl } from 'react-intl';
import { SpecificSidePanelProps } from './types';
import ExtensionStatusBadge from '../ExtensionStatusBadge-new/ExtensionStatusBadge';
import Permissions from './partials/Permissions';
import DateInstalled from './partials/DateInstalled';
import InstalledBy from './partials/InstalledBy';
import Version from './partials/Version';
import ContractAddress from './partials/ContractAddress';
import Developer from './partials/Developer';
import styles from './SpecificSidePanel.module.css';

const displayName = 'common.Extensions.SpecificSidePanel';

const SpecificSidePanel: FC<SpecificSidePanelProps> = ({ sidePanelData, permissions, status = '', badgeMessage }) => {
  const { formatMessage } = useIntl();

  return (
    <div className="sm:w-full md:w-[17.625rem] lg:w-[20.4375rem] bg-base-white flex gap-[1.25rem] flex-col">
      <h3 className="font-semibold text-lg text-gray-900 pb-[0.2rem]">
        {formatMessage({ id: 'specific.side.panel.title' })}
      </h3>
      <div className={styles.panelRow}>
        <div className={styles.panelTitle}>Status</div>
        <div className="md:w-[50%] justify-start flex flex-col md:flex-row">
          <div className="mr-1 mb-1 md:mb-0">
            {/* @ts-ignore */}
            <ExtensionStatusBadge mode={status} text={badgeMessage} />
          </div>
        </div>
      </div>
      {status !== 'not-installed' && (
        <InstalledBy
          title="Installed by"
          // @ts-ignore
          installedBy={sidePanelData?.installedBy}
          addressWallet={sidePanelData?.address}
          // @ts-ignore
          isVerified={sidePanelData?.isVerified}
        />
      )}
      <DateInstalled title="Date installed" date={sidePanelData?.installedAt} />
      <Version title="Version installed" version={`v${sidePanelData?.availableVersion}`} />
      {status !== 'not-installed' && <ContractAddress title="Contract address" address={sidePanelData?.address} />}
      <Developer title="Developer" developer="Colony" />
      <div className="flex flex-col justify-between">
        <div className="font-normal text-sm text-gray-600 pb-[0.875rem]">
          {formatMessage({ id: 'permissions.list.title' })}
        </div>
        <Permissions data={permissions} />
      </div>
    </div>
  );
};

SpecificSidePanel.displayName = displayName;

export default SpecificSidePanel;
