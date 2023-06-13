import React, { FC, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { useParams } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import clsx from 'clsx';

import { Extension } from '@colony/colony-js';
import { useColonyContext, useExtensionData } from '~hooks';
import ExtensionDetails from './partials/ExtensionDetails';
import Spinner from '~shared/Extensions/Spinner';
import ThreeColumns from '~frame/Extensions/ThreeColumns';
import Navigation from '~common/Extensions/Navigation';
import SupportingDocuments from '~common/Extensions/SupportingDocuments';
import ImageCarousel from '~common/Extensions/ImageCarousel';
import Tabs from '~shared/Extensions/Tabs';
import { tabsItems, mockedExtensionSettings } from './consts';
import TopRow from '../partials/TopRow';

const HeadingChunks = (chunks: React.ReactNode[]) => (
  <h4 className="font-semibold text-gray-900 mt-6 mb-4">{chunks}</h4>
);

const TabContent = (extensionData) => {
  const { isEnabled, uninstallable, descriptionLong } = extensionData;
  return (
    <li
      className={clsx('list-none', {
        'mt-4': isEnabled && uninstallable,
      })}
    >
      <div className="mt:mt-[4.25rem] text-md text-gray-600">
        <FormattedMessage
          {...descriptionLong}
          values={{
            h4: HeadingChunks,
          }}
        />
      </div>
      <div className="mt-6">
        <SupportingDocuments />
      </div>
    </li>
  );
};

const displayName = 'frame.Extensions.pages.ExtensionDetailsPage';

const ExtensionDetailsPage: FC = () => {
  const { extensionId } = useParams();
  const { colony } = useColonyContext();
  const { extensionData } = useExtensionData(extensionId ?? '');
  const { formatMessage } = useIntl();
  const [activeTab, setActiveTab] = useState(0);
  // @TODO: Change extension missing permissions functionality

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

  return (
    <Spinner loadingText={{ id: 'loading.colonyDetailsPage' }}>
      <ThreeColumns
        leftAside={<Navigation />}
        topRow={<TopRow extensionData={extensionData} />}
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
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  {activeTab === 0 && TabContent(extensionData)}
                  {activeTab === 1 && (
                    <li>
                      {mockedExtensionSettings.map((item) => (
                        <div className="border-b border-gray-200 py-4 last:border-none">
                          <div className="flex items-center justify-between">
                            <div className="text-gray-900 text-md font-medium">
                              {item.title}
                            </div>
                            <div className="text-gray-900 text-md font-medium">
                              -{' '}
                              {item.complementaryLabel === 'percent'
                                ? '%'
                                : 'Hours'}
                            </div>
                          </div>
                          <div className="text-gray-00 text-sm">
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
