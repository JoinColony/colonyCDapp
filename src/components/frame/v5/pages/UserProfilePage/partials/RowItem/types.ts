import { type Icon } from '@phosphor-icons/react';

import { type AvatarUploaderProps } from '~v5/common/AvatarUploader/types.ts';
import { type InputProps } from '~v5/common/Fields/Input/index.ts';
import { type SwitchProps } from '~v5/common/Fields/Switch/types.ts';
import { type TextareaProps } from '~v5/common/Fields/Textarea/types.ts';
import { type ButtonMode } from '~v5/shared/Button/types.ts';

interface AvatarProps extends AvatarUploaderProps {
  updateFn: (
    avatar: string | null,
    thumbnail: string | null,
    setProgress: React.Dispatch<React.SetStateAction<number>>,
  ) => Promise<void>;
}
export interface RowItemProps {
  title?: React.ReactNode;
  description?: React.ReactNode;
  buttonProps?: React.HTMLAttributes<HTMLButtonElement> & {
    mode: ButtonMode;
    icon: Icon;
    iconSize: number;
    text?: string;
  };
  copyAddressProps?: { icon: Icon; walletAddress: string };
  inputProps?: InputProps;
  avatarUploaderProps?: AvatarProps;
  textAreaProps?: TextareaProps;
  switchProps?: SwitchProps;
  headerProps?: { title?: string };
  className?: string;
  descriptionClassName?: string;
  contentProps?: JSX.Element;
}
