import React, { FC } from 'react';
import { useIntl } from 'react-intl';
import clsx from 'clsx';

import { useMobile } from '~hooks';
import {
  contributorTypes,
  permissionsTypes,
  reputationType,
  statusTypes,
  teamTypes,
} from '~v5/common/Filter/partials/consts';
import Checkbox from '~v5/common/Checkbox';
import { NestedOptionsProps } from '../types';
import Header from './Header';
import Icon from '~shared/Icon';

const displayName = 'v5.SubNavigationItem.partials.NestedOptions';

const NestedOptions: FC<NestedOptionsProps> = ({
  selectedParentOption,
  selectedChildOption,
  onChange,
}) => {
  const { formatMessage } = useIntl();
  const isMobile = useMobile();

  const preparedFilterOptions =
    (selectedParentOption === 'contributor' && contributorTypes) ||
    (selectedParentOption === 'status' && statusTypes) ||
    (selectedParentOption === 'team' && teamTypes) ||
    (selectedParentOption === 'reputation' && reputationType) ||
    (selectedParentOption === 'permissions' && permissionsTypes) ||
    [];

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
                >
                  {selectedParentOption === 'team' && (
                    <span
                      className={clsx('h-[1rem] w-[1rem] rounded-[0.25rem]', {
                        'bg-blue-400': id === 'teamRoot',
                        'bg-teams-purple-500': id === 'business',
                        'bg-teams-yellow-500': id === 'product',
                        'bg-teams-purple-400': id === 'development',
                        'bg-teams-pink-400': id === 'productDesign',
                        'bg-teams-green-500': id === 'devops',
                      })}
                    />
                  )}
                  {selectedParentOption === 'permissions' && (
                    <Icon
                      name={
                        (id === 'permissionRoot' && 'app-window') ||
                        (id === 'administration' && 'clipboard-text') ||
                        (id === 'arbitration' && 'scales') ||
                        (id === 'architecture' && 'buildings') ||
                        (id === 'funding' && 'bank') ||
                        ((id === 'recovery' &&
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
