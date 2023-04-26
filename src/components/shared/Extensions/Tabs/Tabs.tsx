import React, { FC } from 'react';
import { Tabs as ReactTabs, Tab, TabScreen } from 'react-tabs-scrollable';
import { useIntl } from 'react-intl';
import { TabsProps } from './types';
import styles from './Tabs.module.css';

const displayName = 'Extensions.Tabs';

const Tabs: FC<TabsProps> = ({ items }) => {
  const { formatMessage } = useIntl();
  const [activeTab, setActiveTab] = React.useState(1);

  const handleOnTabClick = (_, id) => {
    setActiveTab(id);
  };

  return (
    <>
      <ReactTabs
        activeTab={activeTab}
        onTabClick={handleOnTabClick}
        tabsUpperContainerClassName={styles.tabList}
        leftNavBtnClassName={styles.navLeftButton}
        rightNavBtnClassName={styles.navRightButton}
        // @ts-ignore - react-tabs-scrollable has invalid type for this prop
        leftBtnIcon={
          <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 30 30">
            <path
              d="M20.3,29.6L6.7,16c-0.5-0.5-0.5-1.4,0-1.9L20.3,0.4c0.5-0.5,1.4-0.5,1.9,0c0.5,0.5,0.5,1.4,0,1.9L9.6,15
    l12.7,12.7c0.5,0.5,0.5,1.4,0,1.9C21.7,30.1,20.8,30.1,20.3,29.6L20.3,29.6z"
            />
          </svg>
        }
        // @ts-ignore - react-tabs-scrollable has invalid type for this prop
        rightBtnIcon={
          <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 30 30">
            <path
              d="M8.6,29.6c-0.5,0.5-1.4,0.5-1.9,0c-0.5-0.5-0.5-1.4,0-1.9L19.3,15L6.7,2.3c-0.5-0.5-0.5-1.4,0-1.9
               s1.4-0.5,1.9,0L22.2,14c0.5,0.5,0.5,1.4,0,1.9L8.6,29.6L8.6,29.6z"
            />
          </svg>
        }
        navBtnClassName={styles.navButton}
        hideNavBtnsOnMobile={false}
      >
        {items.map(({ id, title }) => (
          <Tab key={id}>{formatMessage({ id: `tabs.${id}`, defaultMessage: `${title}` })}</Tab>
        ))}
      </ReactTabs>
      {items.map(({ id, content }) => (
        <TabScreen className={styles.panel} key={id} activeTab={activeTab} index={id}>
          {content}
        </TabScreen>
      ))}
    </>
  );
};

Tabs.displayName = displayName;

export default Tabs;
