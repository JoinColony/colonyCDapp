import React, { FC, Fragment } from 'react';
import { useIntl } from 'react-intl';
import { SpecificSidePanelProps } from './types';
import styles from './SpecificSidePanel.module.css';
import ExtensionStatusBadge from '../ExtensionStatusBadge-new/ExtensionStatusBadge';
import Permissions from './partials/Permissions';

const displayName = 'common.Extensions.SpecificSidePanel';

const SpecificSidePanel: FC<SpecificSidePanelProps> = ({ types, sidepanelData }) => {
  const { formatMessage } = useIntl();

  return (
    <div className="sm:w-[23.75rem] md:w-[17.625rem] lg:w-[20.4375rem] bg-base-white">
      <h3 className="font-semibold text-lg text-gray-900 pb-[1.375rem]">
        {formatMessage({ id: 'specific.side.panel.title' })}
      </h3>
      {sidepanelData.map((item) => (
        <Fragment key={item.id}>
          <div className={styles.panelRow} key={item.statusType.title}>
            <div className={styles.panelTitle}>{item.statusType.title}</div>
            <div className="w-[50%] justify-start flex flex-row">
              {types?.map((type) => (
                <div className=" mr-1" key={type}>
                  <ExtensionStatusBadge mode={type} text={type} />
                </div>
              ))}
            </div>
          </div>
          {types?.[0] === 'not-installed' && (
            <div className={styles.panelRow} key={item.dateInstalled.title}>
              <div className={styles.panelTitle}>{item.dateInstalled.title}</div>
              <div className={styles.panelData}>{item.dateInstalled.date}</div>
            </div>
          )}
          {types?.[0] !== 'not-installed' && (
            <div className={styles.panelRow} key={item.instaledBy.title}>
              <div className={styles.panelTitle}>{item.instaledBy.title}</div>
              <div>{item.instaledBy.component}</div>
            </div>
          )}
          <div className={styles.panelRow} key={item.versionInstalled.title}>
            <div className={styles.panelTitle}>{item.versionInstalled.title}</div>
            <div className={styles.panelData}>{item.versionInstalled.version}</div>
          </div>
          {types?.[0] !== 'not-installed' && (
            <div className={styles.panelRow} key={item.contractAddress.title}>
              <div className={styles.panelTitle}>{item.contractAddress.title}</div>
              <div className={styles.panelData}>{item.contractAddress.address}</div>
            </div>
          )}
          <div className={styles.panelRow} key={item.developer.title}>
            <div className={styles.panelTitle}>{item.developer.title}</div>
            <div className={styles.panelData}>{item.developer.developer}</div>
          </div>
          <div className="flex flex-col justify-between" key={item.permissions.title}>
            <div className="font-normal text-sm text-gray-600 pb-[0.875rem]">{item.permissions.title}</div>
            <Permissions data={item.permissions.permissions} />
          </div>
        </Fragment>
      ))}
    </div>
  );
};

SpecificSidePanel.displayName = displayName;

export default SpecificSidePanel;
