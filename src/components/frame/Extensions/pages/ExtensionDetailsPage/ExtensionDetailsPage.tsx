import React, { FC, useState } from 'react';
import { useIntl } from 'react-intl';
import { useParams } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Extension } from '@colony/colony-js';

import { useColonyContext, useExtensionData } from '~hooks';
import ExtensionDetails from './partials/ExtensionDetails';
import Spinner from '~shared/Extensions/Spinner';
import ThreeColumns from '~v5/frame/ThreeColumns';
import Navigation from '~v5/common/Navigation';
import ImageCarousel from '~common/Extensions/ImageCarousel';
import ActionButtons from '../partials/ActionButtons';
import Tabs from '~shared/Extensions/Tabs';
import { tabsItems, mockedExtensionSettings } from './consts';
import NotificationBanner from '~common/Extensions/NotificationBanner';
import { isInstalledExtensionData } from '~utils/extensions';
import { accordionAnimation } from '~constants/accordionAnimation';
import TabContent from './partials/TabContent';

const displayName = 'frame.Extensions.pages.ExtensionDetailsPage';

const ExtensionDetailsPage: FC = () => {
  const { extensionId } = useParams();
  const { colony } = useColonyContext();
  const { extensionData } = useExtensionData(extensionId ?? '');
  const { formatMessage } = useIntl();
  const [activeTab, setActiveTab] = useState(0);
  // @TODO: Change extension missing permissions functionality
  const [isPermissionEnabled, setIsPermissionEnabled] = useState(false);

  if (!colony || !extensionData) {
    return null;
  }

  if (!extensionData) {
    return (
      <p>
        {formatMessage({ id: 'extensionDetailsPage.unsupportedExtension' })}
      </p>
    );
  }

  const handleOnTabClick = (_, id) => {
    setActiveTab(id);
  };
  const showEnableBanner =
    extensionData.extensionId !== 'VotingReputation' &&
    !isInstalledExtensionData(extensionData);

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
              <div className="flex flex-wrap gap-4 flex-col w-full sm:flex-row sm:items-center md:gap-8">
                <ActionButtons
                  extensionData={extensionData}
                  extensionStatusMode="payments"
                  extensionStatusText={formatMessage({ id: 'status.payments' })}
                />
              </div>
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
                          <div className="flex items-center justify-between text-1">
                            <p>{item.title}</p>
                            <div>
                              -{' '}
                              {item.complementaryLabel === 'percent'
                                ? '%'
                                : 'Hours'}
                            </div>
                          </div>
                          <p className="text-sm">{item.description}</p>
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
