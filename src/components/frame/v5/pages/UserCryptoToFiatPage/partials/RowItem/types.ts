import { type ReactNode, type PropsWithChildren } from 'react';
import { type MessageDescriptor } from 'react-intl';

import { type CryptoToFiatBadgeProps } from '~v5/common/Pills/CryptoToFiatBadge.tsx/types.ts';

import type React from 'react';

export interface RowItemProps extends PropsWithChildren {}

export interface RowItemHeadingProps {
  title: ReactNode;
  accessory: ReactNode;
  badgeProps: CryptoToFiatBadgeProps;
  itemIndex: number;
  isDataLoading: boolean;
}

export interface RowItemBodyProps {
  title?: ReactNode;
  description?: ReactNode;
  descriptionComponent?: ReactNode;
  ctaTitle?: MessageDescriptor;
  ctaDisabled?: boolean;
  ctaOnClick?: () => void;
  ctaComponent?: React.ReactNode;
  isDataLoading?: boolean;
}
