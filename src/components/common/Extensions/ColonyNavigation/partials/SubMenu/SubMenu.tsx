import React, { FC } from 'react';
import { useIntl } from 'react-intl';
import clsx from 'clsx';

import { SubMenuProps } from './types';
import LearnMore from '~shared/Extensions/LearnMore';
import { LEARN_MORE_PAYMENTS } from '~constants';
import Card from '~v5/shared/Card';
import Button from '~v5/shared/Button';
import ExtensionStatusBadge from '~v5/common/Pills/ExtensionStatusBadge';
import { useMobile } from '~hooks';
import styles from './SubMenu.module.css';
import Link from '~v5/shared/Link';
import { useActionSidebarContext } from '~context/ActionSidebarContext';

const displayName = 'common.Extensions.MainNavigation.partials.SubMenu';

const SubMenu: FC<SubMenuProps> = ({ items }) => {
  const isMobile = useMobile();
  const { formatMessage } = useIntl();
  const Wrapper = isMobile ? 'div' : Card;
  const {
    actionSidebarToggle: [, { toggle: toggleActionSideBar }],
  } = useActionSidebarContext();

  return (
    <Wrapper hasShadow={!isMobile} className="w-full">
      <ul
        className={clsx(styles.subMenuList, {
          'grid-cols-[repeat(3,1fr)]': !isMobile,
        })}
      >
        {items.map(({ label, href, description, status }) => (
          <li key={label}>
            <Link
              to={href}
              className={clsx(styles.linkItem, 'sm:w-[11.25rem]')}
            >
              <span className="flex justify-between font-semibold min-h-[1.625rem] mb-1">
                {formatMessage({
                  id: `subMenu.item.${label}`,
                  defaultMessage: `${label}`,
                })}
                {status?.text && (
                  <span className="ml-1 shrink-0">
                    <ExtensionStatusBadge
                      text={status.text}
                      mode={status.mode}
                    />
                  </span>
                )}
              </span>
              <p className="text-gray-600 text-md">
                {formatMessage({
                  id: `subMenuItem.${label}`,
                  defaultMessage: `${description}`,
                })}
              </p>
            </Link>
          </li>
        ))}
      </ul>
      {!isMobile && (
        <div className="px-3">
          <span className="divider mb-6" />
          <div className="flex flex-col items-center justify-between sm:flex-row">
            <div className="mb-6 sm:mr-2 sm:mb-0">
              <Button
                text="Create new action"
                mode="quinary"
                onClick={() => toggleActionSideBar()}
                isFullSize={isMobile}
              />
            </div>
            <LearnMore
              message={{
                id: `${displayName}.helpText`,
                defaultMessage: 'Need help and guidance? <a>Visit our docs</a>',
              }}
              href={LEARN_MORE_PAYMENTS}
            />
          </div>
        </div>
      )}
    </Wrapper>
  );
};

SubMenu.displayName = displayName;

export default SubMenu;
