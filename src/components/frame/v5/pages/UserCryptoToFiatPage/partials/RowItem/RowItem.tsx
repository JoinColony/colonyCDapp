import React from 'react';

import hocWithLoading from '~common/HocWithLoading/index.ts';
import CryptoToFiatBadge from '~v5/common/Pills/CryptoToFiatBadge.tsx/CryptoToFiatBadge.tsx';
import Button from '~v5/shared/Button/Button.tsx';

import {
  type RowItemProps,
  type RowItemBodyProps,
  type RowItemHeadingProps,
} from './types.ts';

const displayName = 'v5.pages.UserCryptoToFiatPage.partials.RowItem';

const CrytoToFiatBadgeWithLoading = hocWithLoading(CryptoToFiatBadge);

const ButtonWithLoading = hocWithLoading(Button);

const Heading: React.FC<RowItemHeadingProps> = ({
  title,
  accessory,
  badgeProps,
  itemIndex,
  isDataLoading,
}) => {
  return (
    <div>
      <div className="flex items-center justify-between">
        <section className="flex items-center gap-2 text-md font-bold">
          <section className="flex aspect-square h-6 items-center justify-center rounded-full bg-base-black text-sm text-base-white">
            {itemIndex}
          </section>
          <section className="flex items-end gap-1">
            <h4>{title}</h4>
            <span className="text-xs font-thin leading-[19px] text-gray-600">
              ({accessory})
            </span>
          </section>
        </section>
        <section>
          <CrytoToFiatBadgeWithLoading
            {...badgeProps}
            isLoading={isDataLoading}
            skeletonFrame={{ width: 66, height: 26, borderRadius: 24 }}
          />
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
  return (
    <div className="flex items-end justify-between">
      <section className="max-w-[742px]">
        {descriptionComponent ?? (
          <div className="flex flex-col gap-1">
            {title && <h5 className="mr-1.5 text-1">{title}</h5>}
            {description && (
              <p className="text-sm text-gray-600">{description}</p>
            )}
          </div>
        )}
      </section>
      <section className="flex min-w-[200px] justify-end">
        {ctaComponent ?? (
          <ButtonWithLoading
            type="button"
            text={ctaTitle}
            onClick={ctaOnClick}
            disabled={ctaDisabled}
            isLoading={isDataLoading}
            skeletonFrame={{ width: 113, height: 40 }}
          />
        )}
      </section>
    </div>
  );
};

const Container: React.FC<RowItemProps> = ({ children }) => {
  return <div className="flex flex-col gap-3">{children}</div>;
};

Body.displayName = `${displayName}.Body`;
Heading.displayName = `${displayName}.heading`;
Container.displayName = `${displayName}.Container`;

const RowItem = { Heading, Container, Body };

export default RowItem;
