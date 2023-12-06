import React, { FC, useCallback, useState } from 'react';
import { Props as ReactSelectProps, SingleValue } from 'react-select';

import { useMemberContext } from '~context/MemberContext';
import { formatText } from '~utils/intl';
import { DropdownIndicator, SelectBase } from '~v5/common/Fields/Select';

import CustomOption from './partials/CustomOption';
import { MemberSelectProps, MembersSelectOption } from './types';
import styles from './MembersSelect.module.css';

const displayName = 'v5.MembersSelect';

const MembersSelect: FC<MemberSelectProps> = ({
  onChange,
  isSearchable = false,
  options,
  defaultValue,
  ...rest
}) => {
  const { filteredMembers, loading } = useMemberContext();
  const [selectedMember, setSelectedMember] = useState<
    MembersSelectOption['value'] | undefined
  >(defaultValue || undefined);

  const selectOptions = filteredMembers?.reduce<MembersSelectOption[]>(
    (result, member) => {
      if (!member) {
        return result;
      }

      const { contributorAddress } = member;
      const { profile } = member.user || {};

      return [
        ...result,
        {
          value: contributorAddress,
          label: profile?.displayName || contributorAddress,
          avatar: profile?.thumbnail || profile?.avatar || '',
          id: result.length,
          showAvatar: true,
        },
      ];
    },
    [],
  );

  const handleChange = useCallback<
    Exclude<ReactSelectProps<MembersSelectOption>['onChange'], undefined>
  >(
    (newValue, actionMeta) => {
      if (Array.isArray(newValue)) {
        return;
      }

      if (!onChange) {
        setSelectedMember(
          newValue && 'value' in newValue ? newValue.value : undefined,
        );

        return;
      }

      onChange(newValue as SingleValue<MembersSelectOption>, actionMeta);
    },
    [onChange],
  );

  return (
    <SelectBase<MembersSelectOption>
      className={styles.wrapper}
      classNames={{
        menu: () => styles.menu,
      }}
      components={{
        DropdownIndicator,
        IndicatorSeparator: null,
      }}
      formatOptionLabel={CustomOption}
      isSearchable={isSearchable}
      options={options || selectOptions}
      isLoading={loading}
      menuPortalTarget={document.body}
      name="test"
      placeholder={formatText({ id: 'members.modal.selectMember' })}
      onChange={handleChange}
      value={selectedMember}
      defaultValue={defaultValue}
      {...rest}
    />
  );
};

MembersSelect.displayName = displayName;

export default MembersSelect;
