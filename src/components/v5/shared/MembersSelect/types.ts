import {
  SelectBaseOption,
  SelectBaseProps,
} from '~v5/common/Fields/Select/types';

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
