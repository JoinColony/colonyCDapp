import { type ParseResult } from 'papaparse';

import { type ModalProps } from '~v5/shared/Modal/types.ts';

export interface FileUploadModalProps extends ModalProps {
  onUpload: (file: ParseResult<unknown>) => void;
}
