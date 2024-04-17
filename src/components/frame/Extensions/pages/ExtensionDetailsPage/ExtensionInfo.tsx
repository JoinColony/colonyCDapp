import { Extension } from '@colony/colony-js';
import { AnimatePresence, motion } from 'framer-motion';
import React, { type FC, useState } from 'react';

import { accordionAnimation } from '~constants/accordionAnimation.ts';
import Tabs from '~shared/Extensions/Tabs/Tabs.tsx';
import {
  type AnyExtensionData,
  type InstalledExtensionData,
} from '~types/extensions.ts';

import MultiSigPageSetup from '../MultiSigPage/MultiSigPageSetup.tsx';

import { tabsItems } from './consts.ts';
import LazyConsensusSettingsTab from './partials/LazyConsensusSettingsTab.tsx';
import TabContent from './partials/TabContent.tsx';

interface ExtensionInfoProps {
  extensionData: AnyExtensionData;
}

const displayName = 'pages.ExtensionDetailsPage.ExtensionInfo';

const ExtensionInfo: FC<ExtensionInfoProps> = ({ extensionData }) => {
  const [activeTab, setActiveTab] = useState(0);

  const handleOnTabClick = (_, id) => {
    setActiveTab(id);
  };

  const getSecondExtensionTab = () => {
    switch (extensionData.extensionId) {
      case Extension.VotingReputation:
        return (
          <LazyConsensusSettingsTab
            extension={Extension.VotingReputation}
            params={
              (extensionData as InstalledExtensionData).params?.votingReputation
            }
          />
        );
      case Extension.MultisigPermissions:
        return <MultiSigPageSetup extensionData={extensionData} />;
      default:
        return null;
    }
  };

  /* @TODO: handle case when more than one accordion in extension settings view will be visible */

  if (
    extensionData?.isInitialized &&
    extensionData.extensionId &&
    tabsItems[extensionData.extensionId] !== undefined
  ) {
    return (
      <Tabs
        items={tabsItems[extensionData.extensionId] ?? []}
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
              {activeTab === 0 && <TabContent extensionData={extensionData} />}
              {activeTab === 1 && getSecondExtensionTab()}
            </motion.div>
          </AnimatePresence>
        </ul>
      </Tabs>
    );
  }

  return (
    <div>
      <TabContent extensionData={extensionData} />
    </div>
  );
};

ExtensionInfo.displayName = displayName;

export default ExtensionInfo;
