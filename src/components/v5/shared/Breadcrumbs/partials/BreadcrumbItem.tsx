import { type FC } from 'react';
import React from 'react';

import { formatText } from '~utils/intl.ts';

import { breadcrumbItemNames } from '../consts.ts';

const displayName = 'v5.Breadcrumbs.partials.BreadcrumbItem';

interface BreadcrumbItemProps {
  parameter: string;
}
const BreadcrumbItem: FC<BreadcrumbItemProps> = ({ parameter }) => {
  const itemName = breadcrumbItemNames[parameter];

  if (itemName) {
    return <span>{formatText(itemName)}</span>;
  }

  return <span className="capitalize">{parameter}</span>;
};

BreadcrumbItem.displayName = displayName;
export default BreadcrumbItem;
