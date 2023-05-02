import React, { FC } from 'react';
import { Tabs as ReactTabs, Tab, TabScreen } from 'react-tabs-scrollable';
import { useIntl } from 'react-intl';
import { TabsProps } from './types';
import styles from './Tabs.module.css';
import Icon from '~shared/Icon';

const displayName = 'Extensions.Tabs';

const Tabs: FC<TabsProps> = ({ items, initialActiveTab = 0 }) => {
  const { formatMessage } = useIntl();
  const [activeTab, setActiveTab] = React.useState(initialActiveTab);

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
        leftBtnIcon={<Icon name="caret-left" appearance={{ size: 'extraTiny' }} />}
        // @ts-ignore - react-tabs-scrollable has invalid type for this prop
        rightBtnIcon={<Icon name="caret-right" appearance={{ size: 'extraTiny' }} />}
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
