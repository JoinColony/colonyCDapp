import { AnimatePresence, motion } from 'framer-motion';
import React, { type FC, useMemo } from 'react';

import { accordionAnimation } from '~constants/accordionAnimation.ts';
import Tabs from '~shared/Extensions/Tabs/Tabs.tsx';
import {
  ExtensionPageTabId,
  type TabsProps,
} from '~shared/Extensions/Tabs/types.ts';
import { type InstalledExtensionData } from '~types/extensions.ts';

import { useExtensionPageContext } from '../../context/ExtensionPageContext.ts';
import { getExtensionDataParams } from '../../utils.tsx';
import ExtensionOverview from '../ExtensionOverview/ExtensionOverview.tsx';

import {
  type ExtensionSettingsComponentsScheme,
  extensionSettingsComponentsScheme,
  extensionTabsSetScheme,
} from './consts.ts';
import { type ExtensionTabsProps } from './types.ts';

const displayName = 'pages.ExtensionPage.partials.ExtensionTabs';

const ExtensionTabs: FC<ExtensionTabsProps> = ({ extensionData }) => {
  const { activeTab, setActiveTab } = useExtensionPageContext();

  const { extensionId } = extensionData;

  const installedExtensionData = extensionData as InstalledExtensionData;

  const handleOnTabClick = (...params: Parameters<TabsProps['onTabClick']>) => {
    const [, id] = params;

    setActiveTab(id);
  };

  const visibleTabItems = useMemo(
    () =>
      extensionTabsSetScheme[extensionId]?.filter((item) => {
        if (item.id === ExtensionPageTabId.Overview) {
          return item;
        }

        if (
          installedExtensionData.isInitialized &&
          installedExtensionData.isEnabled &&
          item.id === ExtensionPageTabId.Settings
        ) {
          return item;
        }
        return false;
      }) ?? [],
    [
      extensionId,
      installedExtensionData.isEnabled,
      installedExtensionData.isInitialized,
    ],
  );

  const ExtensionSettingsComponent =
    extensionSettingsComponentsScheme[
      extensionId as keyof ExtensionSettingsComponentsScheme
    ];

  return (
    <Tabs
      items={visibleTabItems}
      className="pt-6"
      activeTab={activeTab}
      onTabClick={handleOnTabClick}
    >
      <ul className="flex flex-col">
        <AnimatePresence>
          <motion.div
            key="params-tab"
            variants={accordionAnimation}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            {activeTab === ExtensionPageTabId.Overview && (
              <ExtensionOverview extensionData={extensionData} />
            )}
            {activeTab === ExtensionPageTabId.Settings && (
              <ExtensionSettingsComponent
                extensionId={extensionId}
                params={getExtensionDataParams(extensionData)}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </ul>
    </Tabs>
  );
};

ExtensionTabs.displayName = displayName;

export default ExtensionTabs;
