import React, { FC, useState } from 'react';
import { useIntl } from 'react-intl';
import { useParams } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Extension } from '@colony/colony-js';

import { useColonyContext, useExtensionData } from '~hooks';
import ExtensionDetails from './partials/ExtensionDetails';
import Spinner from '~shared/Extensions/Spinner';
import ThreeColumns from '~frame/Extensions/ThreeColumns';
import Navigation from '~common/Extensions/Navigation';
import ImageCarousel from '~common/Extensions/ImageCarousel';
import Tabs from '~shared/Extensions/Tabs';
import { tabsItems, mockedExtensionSettings } from './consts';
import { accordionAnimation } from '~constants/accordionAnimation';
import TabContent from './partials/TabContent';
import NotificationBanner from '~common/Extensions/NotificationBanner';
import ExtensionStatusBadge from '~common/Extensions/ExtensionStatusBadge';
import Icon from '~shared/Icon';
import ActionButtons from '../partials/ActionButtons';
import { useFetchActiveInstallsExtension } from './hooks';
import { isInstalledExtensionData } from '~utils/extensions';
import ActiveInstalls from '../partials/ActiveInstall';

const displayName = 'frame.Extensions.pages.ExtensionDetailsPage';

const ExtensionDetailsPage: FC = () => {
  const { extensionId } = useParams();
  const { colony } = useColonyContext();
  const { extensionData } = useExtensionData(extensionId ?? '');
  const { formatMessage } = useIntl();
  const [activeTab, setActiveTab] = useState(0);
  const [isPermissionEnabled, setIsPermissionEnabled] = useState(false);
  const { oneTxPaymentData, votingReputationData } =
    useFetchActiveInstallsExtension();

  if (!extensionData) {
    return (
      <p>
        {formatMessage({ id: 'extensionDetailsPage.unsupportedExtension' })}
      </p>
    );
  }

  if (!colony) {
    return null;
  }

  const showEnableBanner =
    extensionId !== Extension.VotingReputation &&
    !isInstalledExtensionData(extensionData);

  const activeInstalls = Number(
    extensionData.extensionId === Extension.OneTxPayment
      ? oneTxPaymentData
      : votingReputationData,
  );

  // @TODO: Change extension missing permissions functionality

  const handleOnTabClick = (_, id) => {
    setActiveTab(id);
  };

  return (
    <Spinner loadingText={{ id: 'loading.colonyDetailsPage' }}>
      <ThreeColumns
        leftAside={<Navigation />}
        topRow={
          <>
            {showEnableBanner && (
              <div className="mb-6">
                <NotificationBanner
                  title={
                    isPermissionEnabled
                      ? { id: 'extensionReEnable.notification.updated' }
                      : { id: 'extensionReEnable.notification.missing' }
                  }
                  status={isPermissionEnabled ? 'success' : 'warning'}
                  actionText={
                    isPermissionEnabled
                      ? { id: 'extensionReEnable.notification.enabled' }
                      : { id: 'extensionReEnable.notification.enable' }
                  }
                  actionType="call-to-action"
                  onClick={() => setIsPermissionEnabled(true)}
                />
              </div>
            )}
            <div className="flex justify-between flex-col flex-wrap sm:items-center sm:flex-row sm:gap-6">
              <div className="flex flex-col sm:items-center sm:flex-row sm:gap-2 sm:grow">
                <div className="flex items-center shrink-0">
                  <Icon
                    name={extensionData.icon}
                    appearance={{ size: 'large' }}
                  />
                  <h4 className="ml-2 text-xl font-semibold text-gray-900">
                    {formatMessage(extensionData.name)}
                  </h4>
                </div>
                <div className="flex items-center justify-between gap-4 mt-4 sm:mt-0 sm:grow">
                  <ExtensionStatusBadge
                    mode="payments"
                    text={formatMessage({
                      id: 'status.payments',
                    })}
                  />
                  <ActiveInstalls activeInstalls={activeInstalls} />
                </div>
              </div>
              <ActionButtons extensionData={extensionData} />
            </div>
          </>
        }
        withSlider={<ImageCarousel />}
        rightAside={<ExtensionDetails extensionData={extensionData} />}
      >
        {/* @TODO: handle case when more than one accordion in extension settings view will be visible */}
        {extensionData?.isEnabled &&
        extensionData?.uninstallable &&
        extensionData?.extensionId === Extension.VotingReputation ? (
          <Tabs
            items={tabsItems}
            className="pt-0"
            activeTab={activeTab}
            onTabClick={handleOnTabClick}
          >
            <ul className="flex flex-col">
              <AnimatePresence>
                <motion.div
                  key="stakes-tab"
                  variants={accordionAnimation}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  {activeTab === 0 && TabContent(extensionData)}
                  {activeTab === 1 && (
                    <li>
                      {mockedExtensionSettings.map((item) => (
                        <div
                          key={item.title}
                          className="border-b border-gray-200 py-4 last:border-none"
                        >
                          <div className="flex items-center justify-between text-gray-900 text-md font-medium">
                            <p>{item.title}</p>
                            <div>
                              -{' '}
                              {item.complementaryLabel === 'percent'
                                ? '%'
                                : 'Hours'}
                            </div>
                          </div>
                          <div className="text-gray-900 text-sm">
                            {item.description}
                          </div>
                        </div>
                      ))}
                    </li>
                  )}
                </motion.div>
              </AnimatePresence>
            </ul>
          </Tabs>
        ) : (
          TabContent(extensionData)
        )}
      </ThreeColumns>
    </Spinner>
  );
};

ExtensionDetailsPage.displayName = displayName;

export default ExtensionDetailsPage;
