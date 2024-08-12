import clsx from 'clsx';
import React from 'react';

import LoadingSkeleton from '~common/LoadingSkeleton/LoadingSkeleton.tsx';
import { useMobile } from '~hooks';
import CryptoToFiatBadge from '~v5/common/Pills/CryptoToFiatBadge.tsx/CryptoToFiatBadge.tsx';
import Button from '~v5/shared/Button/Button.tsx';

import {
  type RowItemProps,
  type RowItemBodyProps,
  type RowItemHeadingProps,
} from './types.ts';

const displayName = 'v5.pages.UserCryptoToFiatPage.partials.RowItem';

const Heading: React.FC<RowItemHeadingProps> = ({
  title,
  accessory,
  badgeProps,
  itemIndex,
  isDataLoading,
}) => {
  return (
    <div>
      <div className="flex flex-col-reverse gap-4 sm:flex-row sm:items-center sm:justify-between">
        <section className="flex items-center gap-2 text-md font-bold">
          <section className="flex aspect-square h-6 items-center justify-center rounded-full bg-base-black text-sm text-base-white">
            {itemIndex}
          </section>
          <section className="flex items-end gap-1">
            <h4 className="font-semibold">{title}</h4>
            <span className="text-xs font-thin leading-[19px] text-gray-600">
              ({accessory})
            </span>
          </section>
        </section>
        <section>
          <LoadingSkeleton
            isLoading={isDataLoading}
            className="h-[26px] w-[66px] rounded-[24px]"
          >
            <CryptoToFiatBadge {...badgeProps} />
          </LoadingSkeleton>
        </section>
      </div>
    </div>
  );
};

const Body: React.FC<RowItemBodyProps> = ({
  title,
  description,
  descriptionComponent,
  ctaTitle,
  ctaDisabled,
  ctaOnClick,
  ctaComponent,
  isDataLoading,
}) => {
  const isMobile = useMobile();
  return (
    <div
      className={clsx('flex justify-between sm:items-end', {
        'flex-col sm:flex-row': !ctaComponent,
        'gap-12': !!ctaComponent,
      })}
    >
      <section className="w-full max-w-[742px]">
        {descriptionComponent ?? (
          <div className="flex flex-col gap-1">
            {title && <h5 className="mr-1.5 text-1">{title}</h5>}
            {description && (
              <p className="text-sm text-gray-600">{description}</p>
            )}
          </div>
        )}
      </section>
      <section
        className={clsx('flex sm:min-w-[200px] sm:justify-end', {
          'mt-6 w-full sm:mt-0 sm:w-auto': !ctaComponent,
        })}
      >
        {ctaComponent ?? (
          <LoadingSkeleton
            isLoading={isDataLoading}
            className="h-[40px] w-[113px] rounded-lg"
          >
            <Button
              type="button"
              text={ctaTitle}
              onClick={ctaOnClick}
              disabled={ctaDisabled}
              isFullSize={isMobile}
            />
          </LoadingSkeleton>
        )}
      </section>
    </div>
  );
};

const Container: React.FC<RowItemProps> = ({ children }) => {
  return <div className="flex flex-col gap-3">{children}</div>;
};

Body.displayName = `${displayName}.Body`;
Heading.displayName = `${displayName}.Heading`;
Container.displayName = `${displayName}.Container`;

const RowItem = { Heading, Container, Body };

export default RowItem;
