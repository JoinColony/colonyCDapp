import clsx from 'clsx';
import { utils } from 'ethers';
import React, { type FC } from 'react';
import { useController, useFormContext } from 'react-hook-form';
import { usePopperTooltip } from 'react-popper-tooltip';

import { useAdditionalFormOptionsContext } from '~context/AdditionalFormOptionsContext/AdditionalFormOptionsContext.ts';
import { useMobile } from '~hooks/index.ts';
import { formatText } from '~utils/intl.ts';
import Button from '~v5/shared/Button/Button.tsx';
import SearchSelectPopover from '~v5/shared/SearchSelect/SearchSelectPopover.tsx';
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

  const { getTooltipProps, setTooltipRef, setTriggerRef, triggerRef, visible } =
    usePopperTooltip({
      placement: 'bottom-start',
      trigger: ['click'],
      interactive: true,
      closeOnOutsideClick: true,
    });
  const { readonly } = useAdditionalFormOptionsContext();
  const isMobile = useMobile();
  const selectedMember = usersOptions.options.find((user) => {
    return user.value === field.value.value;
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
    <div className="flex w-full items-center sm:relative">
      {readonly ? (
        <>
          <UserAvatar
            userAvatarSrc={selectedMember?.avatar ?? undefined}
            userName={selectedMember?.label.toString() ?? undefined}
            userAddress={walletAddress}
            size={20}
          />
          <span className="ml-2 text-md font-medium text-gray-900">
            {selectedMember?.label ?? walletAddress}
          </span>
        </>
      ) : (
        <>
          <button
            type="button"
            ref={setTriggerRef}
            className={clsx(
              'flex items-center text-md transition-colors md:hover:text-blue-400',
              {
                'text-gray-400': !isError && !visible,
                'text-negative-400': isError,
                'text-blue-400': visible,
              },
            )}
            aria-label={formatText({ id: 'ariaLabel.selectUser' })}
          >
            {selectedMember ||
            (walletAddress && typeof walletAddress === 'string') ? (
              <>
                <UserAvatar
                  userAvatarSrc={selectedMember?.avatar ?? undefined}
                  userName={selectedMember?.label.toString() ?? undefined}
                  userAddress={walletAddress}
                  size={20}
                />
                <span
                  className={clsx(
                    'ml-2 text-md font-medium text-gray-900 hover:text-blue-400',
                    {
                      'text-negative-400': isError,
                    },
                  )}
                >
                  {selectedMember?.label ?? walletAddress}
                </span>
              </>
            ) : (
              formatText({ id: 'actionSidebar.selectMember' })
            )}
          </button>
          {visible && (
            // FIXME: Remeber to test this
            <SearchSelectPopover
              triggerRef={triggerRef}
              tooltipProps={getTooltipProps}
              setTooltipRef={setTooltipRef}
              items={[usersOptions]}
              onSelect={onMemberSelect}
              checkboxesList={checkedItems}
              className={clsx('!max-h-[18.25rem]', {
                'left-6 right-[1.9rem] w-auto': isMobile,
              })}
              showEmptyContent
              additionalButtons={
                isMobile && (
                  <div className="flex items-center justify-between gap-2 pt-2">
                    <Button
                      mode="primarySolid"
                      size="small"
                      onClick={triggerRef?.click}
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
