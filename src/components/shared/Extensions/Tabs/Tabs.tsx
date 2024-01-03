import { clsx } from 'clsx';
import React, { FC, PropsWithChildren } from 'react';
import { Tabs as ReactTabs, Tab, TabScreen } from 'react-tabs-scrollable';

import Icon from '~shared/Icon';
import { formatText } from '~utils/intl';

import { TabsProps } from './types';

const displayName = 'Extensions.Tabs';

const Tabs: FC<PropsWithChildren<TabsProps>> = ({
  items,
  activeTab,
  onTabClick,
  className,
  children,
}) => (
  <>
    <ReactTabs
      activeTab={activeTab}
      onTabClick={onTabClick}
      tabsUpperContainerClassName={`relative flex items-center w-full font-semibold before:absolute before:bottom-0
       before:left-0 before:w-full before:bg-gray-200 before:block before:h-px before:content-[" "] p-0`}
      leftNavBtnClassName="absolute top-[50%] translate-y-[-50%] left-0 z-10"
      rightNavBtnClassName="z-10"
      // @ts-ignore - react-tabs-scrollable has invalid type for this prop
      leftBtnIcon={
        <Icon name="caret-left" appearance={{ size: 'extraTiny' }} />
      }
      // @ts-ignore - react-tabs-scrollable has invalid type for this prop
      rightBtnIcon={
        <Icon name="caret-right" appearance={{ size: 'extraTiny' }} />
      }
      navBtnClassName="transition-colors duration-normal border-none bg-gray-200 w-[1.375rem] h-[1.375rem] rounded flex items-center justify-center shrink-0 sm:hover:bg-gray-300 [&_i]:w-[0.625em] [&_i]:h-[0.625em]"
      hideNavBtnsOnMobile={false}
    >
      {items.map(({ id, title, notificationNumber }) => (
        <Tab
          key={id}
          className={clsx({
            '!font-semibold': id === activeTab,
            'text-gray-700': id !== activeTab,
          })}
        >
          {formatText({ id: `tabs.${id}`, defaultMessage: `${title}` })}
          {!!notificationNumber && (
            <span className="flex items-center justify-center text-blue-400 text-[0.375rem] font-bold bg-blue-100 rounded-sm ml-1 w-[0.75rem] h-[0.75rem] pointer-events-none">
              <span>{notificationNumber}</span>
            </span>
          )}
        </Tab>
      ))}
    </ReactTabs>
    {items.map(({ id, content }) => (
      <TabScreen
        className={clsx('pt-6', className)}
        key={id}
        activeTab={activeTab}
        index={id}
      >
        {content || children}
      </TabScreen>
    ))}
  </>
);

Tabs.displayName = displayName;

export default Tabs;
