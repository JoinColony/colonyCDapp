import { Extension } from '@colony/colony-js';
import { AnimatePresence, motion } from 'framer-motion';
import React, { type FC } from 'react';

import { accordionAnimation } from '~constants/accordionAnimation.ts';
import Tabs from '~shared/Extensions/Tabs/Tabs.tsx';
import {
  type AnyExtensionData,
  type InstalledExtensionData,
} from '~types/extensions.ts';
import { isInstalledExtensionData } from '~utils/extensions.ts';

import MultiSigPageSetup from '../MultiSigPage/MultiSigPageSetup.tsx';

import LazyConsensusSettingsTab from './partials/LazyConsensusSettingsTab.tsx';
import TabContent from './partials/TabContent.tsx';
import { getExtensionTabs } from './utils.tsx';

interface ExtensionInfoProps {
  extensionData: AnyExtensionData;
  activeTab: number;
  onActiveTabChange: (activeTab: number) => void;
}

const displayName = 'pages.ExtensionDetailsPage.ExtensionInfo';

const ExtensionInfo: FC<ExtensionInfoProps> = ({
  extensionData,
  activeTab,
  onActiveTabChange,
}) => {
  const isExtensionInstalled = isInstalledExtensionData(extensionData);

  const handleOnTabClick = (_, id) => {
    onActiveTabChange(id);
  };

  const getSecondExtensionTab = () => {
    // @TODO get rid of this casting and typeguarrd this instead
    switch (extensionData.extensionId) {
      case Extension.VotingReputation:
        return (
          <LazyConsensusSettingsTab
            extension={Extension.VotingReputation}
            extensionData={extensionData}
            params={
              (extensionData as InstalledExtensionData).params?.votingReputation
            }
          />
        );
      case Extension.MultisigPermissions:
        return (
          <MultiSigPageSetup
            extensionData={extensionData as InstalledExtensionData}
          />
        );
      default:
        return null;
    }
  };

  /* @TODO: handle case when more than one accordion in extension settings view will be visible */
  const extensionTabs = getExtensionTabs(
    extensionData.extensionId,
    isExtensionInstalled,
  );

  return (
    <Tabs
      items={extensionTabs}
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
};

ExtensionInfo.displayName = displayName;

export default ExtensionInfo;
