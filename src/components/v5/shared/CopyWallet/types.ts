import { ButtonHTMLAttributes } from 'react';

export interface CopyWalletProps
  extends Omit<
    ButtonHTMLAttributes<HTMLButtonElement>,
    'title' | 'aria-label'
  > {
  disabled?: boolean;
  handleClipboardCopy: () => void;
  walletAddress: string;
  isCopied?: boolean;
}
