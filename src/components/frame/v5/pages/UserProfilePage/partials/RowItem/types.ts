import { AvatarUploaderProps } from '~v5/common/AvatarUploader/types.ts';
import { InputProps } from '~v5/common/Fields/Input/index.ts';
import { SwitchProps } from '~v5/common/Fields/Switch/types.ts';
import { TextareaProps } from '~v5/common/Fields/Textarea/types.ts';
import { ButtonMode, IconSize } from '~v5/shared/Button/types.ts';

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
    iconName: string;
    iconSize: IconSize;
    text?: string;
  };
  copyAddressProps?: { iconName: string; walletAddress: string };
  inputProps?: InputProps;
  avatarUploaderProps?: AvatarProps;
  textAreaProps?: TextareaProps;
  switchProps?: SwitchProps;
  headerProps?: { title?: string };
  className?: string;
  descriptionClassName?: string;
  contentProps?: JSX.Element;
}
