import clsx from 'clsx';
import React, { type PropsWithChildren, type FC, Fragment } from 'react';

import Tooltip from '~shared/Extensions/Tooltip/Tooltip.tsx';
import TextButton from '~v5/shared/Button/TextButton.tsx';
import Link from '~v5/shared/Link/Link.tsx';

import { type UserHubInfoSectionProps } from './types.ts';

const UserHubInfoSection: FC<PropsWithChildren<UserHubInfoSectionProps>> = ({
  title,
  items,
  viewLinkProps,
  className,
  children,
}) => {
  return (
    <div className={clsx(className)}>
      <div className="flex items-center justify-between gap-4">
        <h6 className="text-xs font-medium uppercase leading-[1.125rem] text-gray-400">
          {title}
        </h6>
        {viewLinkProps && (
          <>
            {'to' in viewLinkProps ? (
              <Link
                {...viewLinkProps}
                className={clsx(
                  viewLinkProps.className,
                  'text-xs font-medium leading-[1.125rem] text-blue-400',
                )}
              />
            ) : (
              <TextButton
                {...viewLinkProps}
                mode={viewLinkProps.mode || 'link'}
              />
            )}
          </>
        )}
      </div>
      {!!items.length && (
        <dl className="mt-4 grid w-full grid-cols-2 gap-x-4 gap-y-2 text-sm leading-[1.125rem] text-gray-900">
          {items.map(({ key, label, labelTooltip, value, valueTooltip }) => (
            <Fragment key={key}>
              <dt className="col-start-1">
                {labelTooltip ? (
                  <Tooltip
                    tooltipContent={labelTooltip}
                    className="!inline-flex"
                    placement="top-start"
                  >
                    {label}
                  </Tooltip>
                ) : (
                  label
                )}
              </dt>
              <dd className="col-start-2 text-right font-medium">
                {valueTooltip ? (
                  <Tooltip
                    tooltipContent={valueTooltip}
                    className="!inline-flex"
                    placement="top-end"
                  >
                    {value}
                  </Tooltip>
                ) : (
                  value
                )}
              </dd>
            </Fragment>
          ))}
        </dl>
      )}
      {children && <div className="mt-[1.125rem] w-full">{children}</div>}
    </div>
  );
};

export default UserHubInfoSection;
