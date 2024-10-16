import { Pencil, ShieldStar, X } from '@phosphor-icons/react';
import React, { type PropsWithChildren, type FC } from 'react';

import { CoreAction } from '~actions';
import { useActionSidebarContext } from '~context/ActionSidebarContext/ActionSidebarContext.ts';
import { useMobile } from '~hooks';
import useToggle from '~hooks/useToggle/index.ts';
import { formatText } from '~utils/intl.ts';
import { ACTION_TYPE_FIELD_NAME } from '~v5/common/ActionSidebar/consts.ts';
// FIXME: This should probably be somewhere more common
import PermissionsModal from '~v5/common/ActionSidebar/partials/forms/core/ManagePermissionsForm/partials/PermissionsModal/PermissionsModal.tsx';
import Button from '~v5/shared/Button/Button.tsx';
import MeatBallMenu from '~v5/shared/MeatBallMenu/MeatBallMenu.tsx';

import { defaultPermissionsPageFilterValue } from '../hooks.tsx';

import PermissionsPageFilter from './PermissionsPageFilter.tsx';
import { type PermissionsPageFilterProps } from './types.ts';

const displayName =
  'frame.Extensions.pages.PermissionsPage.partials.PermissionsPageContent';

const PermissionsPageContent: FC<
  PropsWithChildren<PermissionsPageFilterProps>
> = ({ children, filterValue, items, onChange, ...filters }) => {
  const isMobile = useMobile();
  const { show } = useActionSidebarContext();
  const [
    isPermissionsModalOpen,
    {
      toggleOff: togglePermissionsModalOff,
      toggleOn: togglePermissionsModalOn,
    },
  ] = useToggle();

  const getActiveFilters = (filterItems, activeFilters) => {
    return filterItems
      .reduce((acc, item) => {
        let activeItem = {};

        if (activeFilters[item.value]) {
          activeItem = { label: item.label, value: item.value };
        }

        if (item.items) {
          const nestedResult = getActiveFilters(item.items, activeFilters);
          if (nestedResult.length > 0) {
            acc.push(...nestedResult);
            if (!acc.label) {
              acc.label = item.name;
            }
          }
        }

        if (Object.keys(activeItem).length > 0) {
          acc.push(activeItem);
          if (!acc.label) {
            acc.label = item.name;
          }
        }

        return acc;
      }, [])
      .filter((item) => Object.keys(item).length > 0);
  };

  const activeFilters = items.map((item) => ({
    label: item.label,
    activeFilters: getActiveFilters(item.items, filterValue),
  }));
  const activeFiltersNumber = activeFilters.reduce(
    (acc, item) => acc + item.activeFilters.length,
    0,
  );

  return (
    <div>
      <div className="flex-col justify-between sm:flex sm:flex-row sm:items-center">
        <div className="mb-2.5 flex items-center gap-2 sm:mb-0">
          <h4 className="heading-4">
            {formatText({ id: 'permissionsPage.permissionTypes' })}
          </h4>
          <MeatBallMenu
            withVerticalIcon
            contentWrapperClassName="w-full max-w-[calc(100%-2.25rem)] sm:max-w-auto sm:w-auto sm:min-w-[17.375rem]"
            items={[
              {
                key: '1',
                icon: ShieldStar,
                label: formatText({
                  id: 'permissionsPage.viewPermissionTypes',
                }),
                onClick: togglePermissionsModalOn,
              },
              // {
              //   key: '2',
              //   icon: <Eye size={16} />,
              //   label: formatText({
              //     id: 'permissionsPage.viewPermissionActions',
              //   }),
              //   renderItemWrapper: (props, children) => (
              //     // @TODO: This should also apply manage permission filter
              //     <Link
              //       to={`/${colony.name}/${COLONY_ACTIVITY_ROUTE}`}
              //       {...props}
              //       className={clsx(props.className, 'md:hover:!text-inherit')}
              //     >
              //       {children}
              //     </Link>
              //   ),
              // },
              {
                key: '3',
                icon: Pencil,
                label: formatText({
                  id: 'permissionsPage.managePermissions',
                }),
                onClick: () => {
                  show({
                    [ACTION_TYPE_FIELD_NAME]: CoreAction.SetUserRoles,
                  });
                },
              },
            ]}
          />
          <PermissionsModal
            onClose={togglePermissionsModalOff}
            isOpen={isPermissionsModalOpen}
          />
        </div>
        <div className="flex items-center gap-2">
          {!isMobile &&
            activeFilters.map((filter) =>
              filter.activeFilters.length ? (
                <div
                  key={filter.label?.toString()}
                  className="inline-flex items-center gap-1 rounded-lg bg-blue-100 px-3 py-2 text-blue-400"
                >
                  <div className="container text-sm font-semibold capitalize">
                    {filter.label}:
                  </div>
                  {filter.activeFilters.map((activeFilter) => (
                    <p
                      key={activeFilter.value}
                      className="min-w-fit text-sm capitalize"
                    >
                      {activeFilter.label}
                      {filter.activeFilters.length > 1 &&
                      filter.activeFilters.indexOf(activeFilter) !==
                        filter.activeFilters.length - 1
                        ? ','
                        : ''}
                    </p>
                  ))}
                  <button
                    type="button"
                    onClick={() => {
                      onChange(defaultPermissionsPageFilterValue);
                    }}
                    className="ml-1 flex-shrink-0"
                  >
                    <X size={12} className="text-inherit" />
                  </button>
                </div>
              ) : null,
            )}
          <PermissionsPageFilter
            activeFiltersNumber={isMobile && activeFiltersNumber}
            filterValue={filterValue}
            onChange={onChange}
            items={items}
            {...filters}
          />
          <Button
            mode="primarySolid"
            size="medium"
            isFullSize={false}
            onClick={() => {
              show({
                [ACTION_TYPE_FIELD_NAME]: CoreAction.SetUserRoles,
              });
            }}
          >
            {formatText({ id: 'permissionsPage.managePermissions' })}
          </Button>
        </div>
      </div>
      {children}
    </div>
  );
};

PermissionsPageContent.displayName = displayName;

export default PermissionsPageContent;
