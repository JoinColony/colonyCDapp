import React, { FC } from 'react';
import { Tabs as ReactTabs, Tab, TabList, TabPanel } from 'react-tabs';
import { useIntl } from 'react-intl';
import styles from './Tabs.module.css';
import { TabsProps } from './types';

const displayName = 'Extensions.Tabs';

const Tabs: FC<TabsProps> = ({ items, ...props }) => {
  const { formatMessage } = useIntl();

  return (
    <ReactTabs className="w-full" {...props}>
      <TabList className={styles.tabList}>
        {items.map(({ id, title }) => {
          return (
            <Tab
              key={id}
              className={styles.tabItem}
              selectedClassName={styles.selected}
              disabledClassName={styles.disabled}
            >
              {formatMessage({ id: `tabs.${id}`, defaultMessage: `${title}` })}
            </Tab>
          );
        })}
      </TabList>
      {items.map(({ id, content }) => (
        <TabPanel key={id} className={styles.panel}>
          {content}
        </TabPanel>
      ))}
    </ReactTabs>
  );
};

Tabs.displayName = displayName;

export default Tabs;
