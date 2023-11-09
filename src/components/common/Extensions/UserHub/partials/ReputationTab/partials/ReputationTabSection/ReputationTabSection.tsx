import clsx from 'clsx';
import React, { FC } from 'react';
import { useMobile } from '~hooks';
import Button from '~v5/shared/Button';
import { ReputationTabSectionProps } from './types';

const ReputationTabSection: FC<ReputationTabSectionProps> = ({
  title,
  additionalHeadingContent,
  items,
  className,
}) => {
  const isMobile = useMobile();

  return (
    <div className={clsx(className, 'w-full')}>
      <div className="mb-2 w-full flex gap-4 items-center justify-between">
        <h4 className="text-4 uppercase text-gray-400">{title}</h4>
        {additionalHeadingContent && <div>{additionalHeadingContent}</div>}
      </div>
      {!!items.length && (
        <dl className="grid grid-cols-2 gap-3.5 md:gap-4">
          {items.map(({ key, title: itemTitle, value, actions }) => {
            const actionsList = actions?.length ? (
              <ul className="flex gap-2 items-center">
                {actions?.map(({ key: actionKey, ...action }) => (
                  <li key={actionKey} className="flex-1 md:flex-auto">
                    <Button
                      mode="primaryOutline"
                      size="extraSmall"
                      iconSize="extraTiny"
                      className="w-full md:w-auto"
                      {...action}
                    />
                  </li>
                ))}
              </ul>
            ) : null;

            return (
              <React.Fragment key={key}>
                <dt className="text-1 text-gray-900 flex items-center gap-4">
                  {itemTitle} {!isMobile && actionsList}
                </dt>
                <dd className="justify-self-end text-right text-3 text-gray-900">
                  {value}
                </dd>
                {isMobile && !!actions?.length && (
                  <dd className="col-span-2 -mt-1">{actionsList}</dd>
                )}
              </React.Fragment>
            );
          })}
        </dl>
      )}
    </div>
  );
};

export default ReputationTabSection;
