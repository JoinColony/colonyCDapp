import { type ModalProps } from '~v5/shared/Modal/types.ts';

export interface FileUploadModalProps extends ModalProps {
  onUpload: (file: CSVFileItem[]) => void;
}

export interface CSVFileItem {
  recipient: string;
  tokenContractAddress: string;
  amount: string;
  claimDelay: string;
}
