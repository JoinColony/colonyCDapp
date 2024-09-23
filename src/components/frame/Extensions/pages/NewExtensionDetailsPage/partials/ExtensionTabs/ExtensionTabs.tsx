import { AnimatePresence, motion } from 'framer-motion';
import React, { type FC } from 'react';

import { accordionAnimation } from '~constants/accordionAnimation.ts';
import { useExtensionDetailsPageContext } from '~frame/Extensions/pages/NewExtensionDetailsPage/context/ExtensionDetailsPageContext.ts';
import { ExtensionDetailsPageTabId } from '~frame/Extensions/pages/NewExtensionDetailsPage/types.ts';
import Tabs from '~shared/Extensions/Tabs/Tabs.tsx';
import { type AnyExtensionData } from '~types/extensions.ts';
import { isInstalledExtensionData } from '~utils/extensions.ts';
import { formatText } from '~utils/intl.ts';

import ExtensionSettings from '../ExtensionSettings/ExtensionSettings.tsx';

import ExtensionOverview from './ExtensionOverview.tsx';

interface ExtensionTabsProps {
  extensionData: AnyExtensionData;
}

const displayName = 'pages.ExtensionDetailsPage.ExtensionInfo';

const ExtensionTabs: FC<ExtensionTabsProps> = ({ extensionData }) => {
  const { activeTab, setActiveTab } = useExtensionDetailsPageContext();

  const handleOnTabClick = (_, id) => {
    setActiveTab(id);
  };

  // @TODO: Make it work with multi sig (that has no init params)
  const shouldShowSettingsTab =
    isInstalledExtensionData(extensionData) &&
    extensionData.initializationParams?.length;

  const tabsItems = [
    {
      id: ExtensionDetailsPageTabId.Overview,
      title: formatText({ id: 'extensionDetailsPage.tabs.overview' }),
    },
    ...(shouldShowSettingsTab
      ? [
          {
            id: ExtensionDetailsPageTabId.Settings,
            title: formatText({
              id: 'extensionDetailsPage.tabs.extensionSettings',
            }),
          },
        ]
      : []),
  ];

  /* @TODO: handle case when more than one accordion in extension settings view will be visible */
  return (
    <Tabs
      items={tabsItems}
      className="pt-6"
      activeTab={activeTab}
      onTabClick={handleOnTabClick}
    >
      <AnimatePresence>
        {activeTab === ExtensionDetailsPageTabId.Overview && (
          <motion.div
            key="params-tab"
            variants={accordionAnimation}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            <ExtensionOverview extensionData={extensionData} />
          </motion.div>
        )}
        {activeTab === ExtensionDetailsPageTabId.Settings &&
          isInstalledExtensionData(extensionData) && (
            <motion.div
              key="params-tab"
              variants={accordionAnimation}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <ExtensionSettings extensionData={extensionData} />
            </motion.div>
          )}
      </AnimatePresence>
    </Tabs>
  );
};

ExtensionTabs.displayName = displayName;

export default ExtensionTabs;
