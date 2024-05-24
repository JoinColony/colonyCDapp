import { type ExpenditurePayoutFieldValue } from '~types/expenditures.ts';
import { type ModalProps } from '~v5/shared/Modal/types.ts';

export interface FileUploadModalProps extends ModalProps {
  onUpload: (file: ExpenditurePayoutFieldValue[]) => void;
  isDataEmpty?: boolean;
}

export interface CSVFileItem {
  address: string;
  tokenContractAddress: string;
  amount: string;
  claimDelay: string;
}
