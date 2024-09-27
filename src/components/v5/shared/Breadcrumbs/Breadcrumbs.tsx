import { CaretRight } from '@phosphor-icons/react';
import clsx from 'clsx';
import React, { type FC } from 'react';
import { useLocation } from 'react-router-dom';

import { useBreadcrumbsContext } from '~context/BreadcrumbsContext/BreadcrumbsContext.ts';

import Link from '../Link/index.ts';

import BreadcrumbItem from './partials/BreadcrumbItem.tsx';

const displayName = 'v5.Breadcrumbs';

interface BreadcrumbsProps {
  className?: string;
}

const Breadcrumbs: FC<BreadcrumbsProps> = ({ className }) => {
  const { rootBreadcrumbItem, shouldShowBreadcrumbs } = useBreadcrumbsContext();
  const location = useLocation();

  if (!shouldShowBreadcrumbs) {
    return null;
  }
  const pathSections = location.pathname
    .split('/')
    .filter((section) => section.length > 0);
  const initialPath = `/${pathSections[0]}`;
  const breadcrumbItems = pathSections.slice(1);

  const getBreadcrumbLink = (index: number) => {
    return `${initialPath}/${breadcrumbItems.slice(0, index + 1).join('/')}`;
  };

  return (
    <ul
      className={clsx(
        className,
        'modal-blur flex items-center gap-2 text-sm text-gray-700',
      )}
    >
      {rootBreadcrumbItem ? (
        <li>
          <Link to={rootBreadcrumbItem?.link}>{rootBreadcrumbItem?.label}</Link>
        </li>
      ) : null}
      {breadcrumbItems.map((item, index) => (
        <React.Fragment key={`breadcrumbItem.${item}`}>
          <CaretRight size={10} />
          <li>
            <Link
              className={clsx({
                'font-semibold': index === breadcrumbItems.length - 1, // if it's the last one, it's active
              })}
              to={getBreadcrumbLink(index)}
            >
              <BreadcrumbItem parameter={item} />
            </Link>
          </li>
        </React.Fragment>
      ))}
    </ul>
  );
};

Breadcrumbs.displayName = displayName;

export default Breadcrumbs;
