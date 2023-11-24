import { User } from '~types';
import {
  SelectBaseOption,
  SelectBaseProps,
} from '~v5/common/Fields/Select/types';

export interface MembersSelectOption extends SelectBaseOption {
  user: User;
}

// export interface MemberSelectProps {
//   user?: User | null;
// }

export type MemberSelectProps = SelectBaseProps<MembersSelectOption>;
