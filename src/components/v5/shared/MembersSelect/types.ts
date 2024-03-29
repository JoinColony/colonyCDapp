import {
  type SelectBaseOption,
  type SelectBaseProps,
} from '~v5/common/Fields/Select/types.ts';

export interface MembersSelectOption extends SelectBaseOption {
  isDisabled?: boolean;
  avatar?: string;
  showAvatar?: boolean;
  color?: string;
  nativeId?: number;
  missingPermissions?: string;
}

// export interface MemberSelectProps {
//   user?: User | null;
// }

export type MemberSelectProps = SelectBaseProps<MembersSelectOption>;
