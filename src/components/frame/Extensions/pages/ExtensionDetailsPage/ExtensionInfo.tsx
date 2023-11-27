import React, { FC, useState } from 'react';
import { Extension } from '@colony/colony-js';
import { AnimatePresence, motion } from 'framer-motion';
import { AnyExtensionData, InstalledExtensionData } from '~types';
import TabContent from './partials/TabContent';
import ParamDetailsTab from './ParamDetailsTab';
import { tabsItems } from './consts';
import Tabs from '~shared/Extensions/Tabs/Tabs';
import { accordionAnimation } from '~constants/accordionAnimation';

interface ExtensionInfoProps {
  extensionData: AnyExtensionData;
}

const displayName = 'pages.ExtensionDetailsPage.ExtensionInfo';

const ExtensionInfo: FC<ExtensionInfoProps> = ({ extensionData }) => {
  const [activeTab, setActiveTab] = useState(0);

  const handleOnTabClick = (_, id) => {
    setActiveTab(id);
  };

  /* @TODO: handle case when more than one accordion in extension settings view will be visible */

  if (
    extensionData?.isInitialized &&
    extensionData?.extensionId === Extension.VotingReputation
  ) {
    return (
      <Tabs
        items={tabsItems[extensionData.extensionId] ?? []}
        className="pt-0"
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
              {activeTab === 1 && (
                <ParamDetailsTab
                  extension={Extension.VotingReputation}
                  params={
                    (extensionData as InstalledExtensionData).params
                      ?.votingReputation
                  }
                />
              )}
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
