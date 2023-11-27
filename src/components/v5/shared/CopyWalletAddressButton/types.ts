import { ButtonHTMLAttributes } from 'react';

export interface CopyWalletAddressButtonProps
  extends Omit<
    ButtonHTMLAttributes<HTMLButtonElement>,
    'title' | 'aria-label'
  > {
  disabled?: boolean;
  handleClipboardCopy: () => void;
  walletAddress: string;
  isCopied?: boolean;
}
