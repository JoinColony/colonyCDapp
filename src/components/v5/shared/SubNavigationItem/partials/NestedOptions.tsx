import React, { FC } from 'react';
import { useIntl } from 'react-intl';
import clsx from 'clsx';

import { useMobile } from '~hooks';
import {
  contributorTypes,
  statusTypes,
} from '~v5/common/Filter/partials/consts';
import Checkbox from '~v5/common/Checkbox';
import { NestedOptionsProps } from '../types';
import Header from './Header';

const displayName = 'v5.SubNavigationItem.partials.NestedOptions';

const NestedOptions: FC<NestedOptionsProps> = ({
  selectedParentOption,
  selectedChildOption,
  onChange,
}) => {
  const { formatMessage } = useIntl();
  const isMobile = useMobile();

  // @TODO: add other filters
  const preparedFilterOptions =
    (selectedParentOption === 'contributor' && contributorTypes) ||
    (selectedParentOption === 'statuses' && statusTypes) ||
    [];

  const filterTitle =
    (selectedParentOption === 'contributor' && 'contributor.type') ||
    (selectedParentOption === 'statuses' && 'status.type') ||
    'contributor.type';

  return (
    <>
      {!isMobile && <Header title={{ id: filterTitle }} />}
      <ul
        className={clsx('flex flex-col', {
          'mt-1': isMobile,
        })}
      >
        {(preparedFilterOptions || []).map(({ id, title }, index) => {
          return (
            <li key={id}>
              <button
                className={clsx('subnav-button', {
                  'px-0': isMobile,
                })}
                type="button"
                aria-label={formatMessage({ id: 'checkbox.select.filter' })}
              >
                <Checkbox
                  id={id}
                  name={id}
                  label={title}
                  onChange={onChange}
                  isChecked={
                    preparedFilterOptions[index].id === id &&
                    preparedFilterOptions[index].id === selectedChildOption
                  }
                />
              </button>
            </li>
          );
        })}
      </ul>
    </>
  );
};

NestedOptions.displayName = displayName;

export default NestedOptions;
