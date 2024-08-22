import { AnimatePresence, motion } from 'framer-motion';
import React, { type FC } from 'react';

import { accordionAnimation } from '~constants/accordionAnimation.ts';
import Tabs from '~shared/Extensions/Tabs/Tabs.tsx';
import { type AnyExtensionData } from '~types/extensions.ts';
import { isInstalledExtensionData } from '~utils/extensions.ts';
import { formatText } from '~utils/intl.ts';

import { useExtensionDetailsPageContext } from '../context/ExtensionDetailsPageContext.ts';
import { ExtensionDetailsPageTabId } from '../types.ts';

import ExtensionOverview from './ExtensionOverview.tsx';
import ExtensionSettings from './ExtensionSettings.tsx';

interface ExtensionInfoProps {
  extensionData: AnyExtensionData;
  showSetupPage?: boolean;
}

const displayName = 'pages.ExtensionDetailsPage.ExtensionInfo';

const ExtensionInfo: FC<ExtensionInfoProps> = ({
  extensionData,
  showSetupPage,
}) => {
  const { activeTab, setActiveTab } = useExtensionDetailsPageContext();
  const handleOnTabClick = (_, id) => {
    setActiveTab(id);
  };

  const tabsItems = [
    {
      id: ExtensionDetailsPageTabId.Overview,
      title: formatText({ id: 'extensionDetailsPage.tabs.overview' }),
    },
    ...(showSetupPage
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

ExtensionInfo.displayName = displayName;

export default ExtensionInfo;