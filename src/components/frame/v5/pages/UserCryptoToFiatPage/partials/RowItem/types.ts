import { type ReactNode, type PropsWithChildren } from 'react';
import { type MessageDescriptor } from 'react-intl';

import type React from 'react';

export interface RowItemProps extends PropsWithChildren {}

export interface RowItemHeadingProps {
  title: MessageDescriptor;
  accessory: MessageDescriptor;
  statusPill: ReactNode;
  itemOrder: number;
}

export interface RowItemBodyProps {
  title?: MessageDescriptor;
  description?: MessageDescriptor;
  descriptionComponent?: React.ReactNode;
  ctaTitle?: MessageDescriptor;
  ctaDisabled?: boolean;
  ctaOnClick?: () => void;
  ctaComponent?: React.ReactNode;
  ctaLoading?: boolean;
}
