import React from 'react';
import { useIntl } from 'react-intl';
import clsx from 'clsx';
import { SubMenuProps } from './types';
import LearnMore from '~shared/Extensions/LearnMore/LearnMore';
import { LEARN_MORE_PAYMENTS } from '~constants';
import Card from '~shared/Extensions/Card';
import Button from '~shared/Extensions/Button';
import ExtensionStatusBadge from '~common/Extensions/ExtensionStatusBadge-new/ExtensionStatusBadge';
import { useMobile } from '~hooks';
import styles from './SubMenu.module.css';

const displayName = 'common.Extensions.MainNavigation.partials.SubMenu';

const SubMenu: React.FC<SubMenuProps> = ({ items }) => {
  const isMobile = useMobile();
  const { formatMessage } = useIntl();
  const Wrapper = isMobile ? 'div' : Card;

  return (
    <Wrapper hasShadow={!isMobile}>
      <ul className={clsx(styles.subMenuList, 'sm:grid-cols-[repeat(2,1fr)] md:grid-cols-[repeat(3,1fr)]')}>
        {items.map(({ label, href, description, status }) => (
          <li key={label}>
            {/* <Link to="/"> */}
            <a {...{ href }} className={clsx(styles.linkItem, 'sm:w-[11.25rem]')}>
              <span className="flex justify-between font-semibold min-h-[1.625rem] mb-1">
                {formatMessage({ id: `subMenu.item.${label}`, defaultMessage: `${label}` })}
                {status?.text && (
                  <span className="ml-1 shrink-0">
                    <ExtensionStatusBadge text={status.text} mode={status.mode} />
                  </span>
                )}
              </span>
              <p className="text-gray-600 text-md">
                {formatMessage({
                  id: `subMenuItem.${label}`,
                  defaultMessage: `${description}`,
                })}
              </p>
            </a>
            {/* </Link> */}
          </li>
        ))}
      </ul>
      {!isMobile && (
        <div className="flex flex-col items-center justify-between px-3 pt-6 border-t border-gray-200 md:flex-row">
          <div className="mb-6 md:mr-2 md:mb-0">
            <Button text="Create new action" mode="secondaryOutline" isFullSize={isMobile} />
          </div>
          <LearnMore
            message={{ id: `${displayName}.helpText`, defaultMessage: 'Need help and guidance? <a>Visit our docs</a>' }}
            href={LEARN_MORE_PAYMENTS}
          />
        </div>
      )}
    </Wrapper>
  );
};

SubMenu.displayName = displayName;

export default SubMenu;
