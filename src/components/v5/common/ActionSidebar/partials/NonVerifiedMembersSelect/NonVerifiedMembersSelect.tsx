import clsx from 'clsx';
import { utils } from 'ethers';
import React, { type FC } from 'react';
import { useController, useFormContext } from 'react-hook-form';

import { useAdditionalFormOptionsContext } from '~context/AdditionalFormOptionsContext/AdditionalFormOptionsContext.tsx';
import { useMobile } from '~hooks/index.ts';
import useRelativePortalElement from '~hooks/useRelativePortalElement.ts';
import useToggle from '~hooks/useToggle/index.ts';
import { formatText } from '~utils/intl.ts';
import Button from '~v5/shared/Button/Button.tsx';
import SearchSelect from '~v5/shared/SearchSelect/index.ts';
import UserAvatar from '~v5/shared/UserAvatar/index.ts';

import { useNonVerifiedMembersSelect } from './hooks.ts';
import { type NonVerifiedMembersSelectProps } from './types.ts';

const displayName =
  'v5.common.ActionsContent.partials.NonVerifiedMembersSelect';

const NonVerifiedMembersSelect: FC<NonVerifiedMembersSelectProps> = ({
  name,
  fieldArrayMethods,
}) => {
  const {
    field,
    fieldState: { error },
  } = useController({
    name,
  });
  const isError = !!error;
  const { usersOptions } = useNonVerifiedMembersSelect();
  const [
    isUserSelectVisible,
    {
      toggle: toggleUserSelect,
      toggleOff: toggleOffUserSelect,
      registerContainerRef,
    },
  ] = useToggle();
  const { readonly } = useAdditionalFormOptionsContext();
  const isMobile = useMobile();
  const selectedMember = usersOptions.options.find((user) => {
    return user.value === field.value.value;
  });

  const { portalElementRef, relativeElementRef } = useRelativePortalElement<
    HTMLButtonElement,
    HTMLDivElement
  >([isUserSelectVisible], {
    withMaxHeight: false,
    withAutoTopPlacement: true,
    withLeftPosition: !isMobile,
  });
  const { getValues, setValue } = useFormContext();
  const checkedItems = getValues('members')
    .filter((obj) => typeof obj.value === 'string')
    .map((obj) => obj.value);

  const onMemberSelect = (value: string | undefined) => {
    if (!value || !utils.isHexString(value)) {
      return;
    }

    const formValues = getValues().members;
    const valueIndex = formValues.findIndex((item) => item?.value === value);

    if (valueIndex !== -1) {
      fieldArrayMethods.remove(valueIndex);
      return;
    }

    const firstEmptyValueIndex = formValues.findIndex((item) => !item?.value);

    if (formValues.length === 0 || firstEmptyValueIndex !== -1) {
      const fieldName =
        firstEmptyValueIndex === -1
          ? 'members'
          : `members.${firstEmptyValueIndex}`;
      setValue(fieldName, { value });
      return;
    }

    fieldArrayMethods.append({ value });
  };

  const walletAddress = field.value.value;

  return (
    <div className="sm:relative w-full flex items-center">
      {readonly ? (
        <UserAvatar
          user={selectedMember || walletAddress}
          size="xs"
          showUsername
        />
      ) : (
        <>
          <button
            type="button"
            ref={relativeElementRef}
            className={clsx(
              'flex items-center text-md transition-colors md:hover:text-blue-400',
              {
                'text-gray-400': !isError && !isUserSelectVisible,
                'text-negative-400': isError,
                'text-blue-400': isUserSelectVisible,
              },
            )}
            onClick={toggleUserSelect}
            aria-label={formatText({ id: 'ariaLabel.selectUser' })}
          >
            {selectedMember ||
            (walletAddress && typeof walletAddress === 'string') ? (
              <UserAvatar
                user={selectedMember || walletAddress}
                avatar={selectedMember?.avatar}
                size="xs"
                showUsername
                className="text-gray-900"
              />
            ) : (
              formatText({ id: 'actionSidebar.selectMember' })
            )}
          </button>
          {isUserSelectVisible && (
            <SearchSelect
              items={[usersOptions]}
              onSelect={onMemberSelect}
              checkboxesList={checkedItems}
              ref={(ref) => {
                registerContainerRef(ref);
                portalElementRef.current = ref;
              }}
              isLoading={usersOptions.isLoading}
              className={clsx('z-[60] !max-h-[18.25rem]', {
                'left-6 right-[1.9rem] w-auto': isMobile,
              })}
              showEmptyContent
              additionalButtons={
                isMobile && (
                  <div className="flex items-center justify-between gap-2 pt-2">
                    <Button
                      mode="primarySolid"
                      size="small"
                      onClick={toggleOffUserSelect}
                      isFullSize
                    >
                      {formatText({ id: 'button.addMembersAndClose' })}
                    </Button>
                  </div>
                )
              }
            />
          )}
        </>
      )}
    </div>
  );
};

NonVerifiedMembersSelect.displayName = displayName;

export default NonVerifiedMembersSelect;
