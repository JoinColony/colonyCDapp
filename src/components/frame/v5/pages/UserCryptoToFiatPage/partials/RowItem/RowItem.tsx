import React from 'react';

import { formatText } from '~utils/intl.ts';
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
  statusPill,
  itemOrder,
}) => {
  return (
    <div>
      <div className="flex items-center justify-between">
        <section className="flex items-center gap-2 text-md font-bold">
          <section className="flex aspect-square h-6 items-center justify-center rounded-full bg-base-black text-sm text-base-white">
            {itemOrder}
          </section>
          <section className="flex items-end gap-1">
            <h4>{formatText(title)}</h4>
            <span className="text-xs font-thin text-gray-600">
              ({formatText(accessory)})
            </span>
          </section>
        </section>
        <section>{statusPill}</section>
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
  ctaLoading,
}) => {
  return (
    <div className="flex items-end justify-between">
      <section className="max-w-[742px]">
        {descriptionComponent ?? (
          <div className="flex flex-col gap-1">
            {title && <h5 className="mr-1.5 text-1">{formatText(title)}</h5>}
            {description && (
              <p className="text-sm text-gray-600">{formatText(description)}</p>
            )}
          </div>
        )}
      </section>
      <section className="flex min-w-[200px] justify-end">
        {ctaComponent ?? (
          <Button
            type="button"
            text={ctaTitle}
            onClick={ctaOnClick}
            disabled={ctaDisabled}
            loading={ctaLoading}
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
