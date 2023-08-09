import React, { FC } from 'react';
import { useIntl } from 'react-intl';
import clsx from 'clsx';

import { useMobile } from '~hooks';
import Checkbox from '~v5/common/Checkbox';
import { NestedOptionsProps } from '../types';
import Header from './Header';
import Icon from '~shared/Icon';

const displayName = 'v5.SubNavigationItem.partials.NestedOptions';

const NestedOptions: FC<NestedOptionsProps> = ({
  selectedParentOption,
  onChange,
  checkedItems,
  nestedFilters,
}) => {
  const { formatMessage } = useIntl();
  const isMobile = useMobile();

  const filterTitle =
    (selectedParentOption === 'contributor' && 'contributor.type') ||
    (selectedParentOption === 'status' && 'status.type') ||
    (selectedParentOption === 'team' && 'team.type') ||
    (selectedParentOption === 'reputation' && 'reputation.type') ||
    ((selectedParentOption === 'permissions' && 'permissions.type') as string);

  return (
    <>
      {!isMobile && <Header title={{ id: filterTitle }} />}
      <ul
        className={clsx('flex flex-col', {
          'mt-1': isMobile,
        })}
      >
        {(nestedFilters || []).map(({ value, color, label }) => {
          return (
            <li key={value}>
              <button
                className={clsx('subnav-button', {
                  'px-0': isMobile,
                })}
                type="button"
                aria-label={formatMessage({ id: 'checkbox.select.filter' })}
              >
                <Checkbox
                  id={value}
                  name={value}
                  label={label}
                  onChange={(e) => onChange?.(e, selectedParentOption)}
                  isChecked={checkedItems?.get(value)}
                  mode="secondary"
                >
                  {selectedParentOption === 'team' && (
                    <span className={clsx(color, 'h-4 w-4 rounded')} />
                  )}
                  {selectedParentOption === 'permissions' && (
                    <Icon
                      name={
                        (value === 'permissionRoot' && 'app-window') ||
                        (value === 'administration' && 'clipboard-text') ||
                        (value === 'arbitration' && 'scales') ||
                        (value === 'architecture' && 'buildings') ||
                        (value === 'funding' && 'bank') ||
                        ((value === 'recovery' &&
                          'clock-counter-clockwise') as string)
                      }
                      appearance={{ size: 'extraSmall' }}
                    />
                  )}
                </Checkbox>
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
